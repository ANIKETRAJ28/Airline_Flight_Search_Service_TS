import { Pool, PoolClient } from 'pg';
import {
  IClassWindowPrice,
  IClassWindowPriceForUser,
  IFlight,
  IFlightQueue,
  IFlightRequest,
  IFlightWithDetails,
  IFlightWithDetailsForUser,
} from '../interface/flights.interface';
import { getPool } from '../util/dbPool.util';
import { IFlightStatus, IFlightWindow } from '../types/flight.types';
import { AirplaneRepository } from './airplane.repository';
import { queryFlightWithDetailById } from '../util/flight.util';
import { CityRepository } from './city.repository';
import { ICityWithCountry } from '../interface/cities.interface';
import {
  classPriceSeat,
  fetchFlightBy,
  fetchFlights,
  returnFlight,
  returnFlightForUser,
} from '../util/flightQuery.util';
import { ApiError } from '../util/api.util';

export class FlightRepository {
  private pool: Pool = getPool();
  private airplaneRepository: AirplaneRepository;
  private cityRepository: CityRepository;

  constructor() {
    this.airplaneRepository = new AirplaneRepository();
    this.cityRepository = new CityRepository();
  }

  async createFlight(data: IFlightRequest): Promise<IFlightWithDetails> {
    const client: PoolClient = await this.pool.connect();
    try {
      const airplane = await this.airplaneRepository.getAirplaneById(data.airplane_id);
      const total_seats =
        data.class_window_price.economy.first_window_seats +
        data.class_window_price.economy.second_window_seats +
        data.class_window_price.economy.third_window_seats +
        data.class_window_price.business.first_window_seats +
        data.class_window_price.business.second_window_seats +
        data.class_window_price.premium.first_window_seats +
        data.class_window_price.premium.second_window_seats;
      if (airplane.capacity !== total_seats) {
        throw new ApiError(
          400,
          `Airplane capacity ${airplane.capacity} does not match total seats ${total_seats} from class window price`,
        );
      }
      let query = `INSERT INTO flights 
                    (airplane_id, departure_airport_id, arrival_airport_id, departure_time, arrival_time, status, price, class_window_price) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
                  RETURNING id`;
      const flightPayload = await client.query(query, [
        data.airplane_id,
        data.departure_airport_id,
        data.arrival_airport_id,
        data.departure_time,
        data.arrival_time,
        data.status,
        data.price,
        JSON.stringify(data.class_window_price),
      ]);
      const flight_id = flightPayload.rows[0].id;
      query = fetchFlightBy('id');
      const result = await client.query(query, [flight_id]);
      const flight = result.rows[0];
      if (flight === undefined) {
        throw new ApiError(404, `Flight with id ${flight_id} not found`);
      }
      return returnFlight(flight, data.class_window_price);
    } finally {
      await client.release();
    }
  }

  async getAllFlights(): Promise<IFlightWithDetails[]> {
    const client: PoolClient = await this.pool.connect();
    try {
      const result = await client.query(fetchFlights);
      const flights = result.rows;
      return flights.map((flight) => returnFlight(flight, flight.class_window_price));
    } finally {
      await client.release();
    }
  }

  async getFlightByIdForAdmin(id: string): Promise<IFlightWithDetails> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = fetchFlightBy('id');
      const result = await client.query(query, [id]);
      const flight = result.rows[0];
      if (flight === undefined) {
        throw new ApiError(404, `Flight with id ${id} not found`);
      }
      return returnFlight(flight, flight.class_window_price);
    } finally {
      await client.release();
    }
  }

  async getFlightByIdForUser(id: string): Promise<IFlightWithDetailsForUser> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = fetchFlightBy('id');
      const result = await client.query(query, [id]);
      const flight = result.rows[0];
      if (flight === undefined) {
        throw new ApiError(404, `Flight with id ${id} not found`);
      }
      const class_window_price: IClassWindowPrice = flight.class_window_price;
      const class_price_seats: IClassWindowPriceForUser = classPriceSeat(flight, class_window_price);
      const flightWithDetails: IFlightWithDetails = returnFlight(flight, class_window_price);
      return returnFlightForUser(flightWithDetails, class_price_seats);
    } finally {
      await client.release();
    }
  }

  async getFlightsForArrivalAndDepartureCity(
    departure_city_id: string,
    arrival_city_id: string,
    day: Date,
  ): Promise<IFlightWithDetailsForUser[][]> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = `
        SELECT * FROM flights
          WHERE departure_time::date = $1
          AND departure_airport_id IN (
            SELECT id FROM airports
            WHERE city_id = $2
          );
      `;
      const departureCityCountry: ICityWithCountry = await this.cityRepository.getCityById(departure_city_id);
      const arrivalCityCountry: ICityWithCountry = await this.cityRepository.getCityById(arrival_city_id);
      let hops = 1;
      //! 1 stop for domestic flight
      // ! 3 stops for international flight
      //! for domestic flights 60 min is min layover time and 180 min is maximum
      //! for international flights 60 min is minimum layover time and 360 min is maximum
      if (departureCityCountry.country.id !== arrivalCityCountry.country.id) hops = 4;
      const flightRoute: IFlight[][] = [];
      // query all the flights for the given day and departure city
      const result = await client.query(query, [day, departure_city_id]);
      const flights: IFlight[] = result.rows;
      // queue for fetching flights with bfs
      const MIN_LAYOVER = 60 * 60 * 1000; // 60 minutes in milliseconds
      const MAX_DOMESTIC_LAYOVER = 180 * 60 * 1000; // 180 minutes in milliseconds
      const MAX_INTERNATIONAL_LAYOVER = 360 * 60 * 1000; // 360 minutes in milliseconds
      const queue: IFlightQueue[][] = [];
      const visited = new Set<string>(); // to keep track of visited flights
      visited.add(departure_city_id); // add the departure city to visited set
      for (const flight of flights) {
        const flightQueueData: IFlightQueue = {
          ...flight,
          hops,
          min_layover_time: MIN_LAYOVER,
          max_layover_time: hops === 1 ? MAX_DOMESTIC_LAYOVER : MAX_INTERNATIONAL_LAYOVER,
        };
        // push all the flights for the day to the queue
        // each flight is a new flightQueueArray
        queue.push([flightQueueData]);
      }
      while (queue.length > 0) {
        // pop from front of the queue
        const flightQueueArray: IFlightQueue[] = queue.shift()!;
        const n = flightQueueArray.length;
        // fetch last flight in the array
        const lastFlightQueue: IFlightQueue = flightQueueArray[n - 1];
        visited.add(lastFlightQueue.arrival_airport_id); // add the last flight's arrival airport to visited set
        // find the last flight's arrival city
        const arrivalCityData = await this.cityRepository.getCityByAirportId(lastFlightQueue.arrival_airport_id);
        if (arrivalCityData.id === arrival_city_id || lastFlightQueue.hops === 0) {
          // if the last flight's arrival city is the same as the arrival city, then we got one route, so push it to the flightRoute
          if (arrivalCityData.id === arrival_city_id) flightRoute.push(flightQueueArray);
          // if hop count is 0 or arrival city is same, then we don't need to check for next flights (prune calls for these cases)
          continue;
        }
        // get all the flights from last flight's arrival airport whose departure and arrival time is within the min and max layover time
        //! assuming, flight takes minimum min_layover_time minutes time and maximum max_layover_time minutes
        const query = `
          SELECT * FROM flights
          WHERE 
            departure_time >= $1 
          AND 
            departure_time <= $2
          AND
            departure_airport_id = $3;
        `;
        // calculate the min and max layover time based on the last flight's arrival time
        const lastFlightQueueArrivalTime = new Date(lastFlightQueue.arrival_time); // get the last flight's arrival time in milliseconds
        const minLayoverTimeLeft = new Date(lastFlightQueueArrivalTime.getTime() + lastFlightQueue.min_layover_time); // calculate the minimum layover time left in milliseconds
        const maxLayoverTimeLeft = new Date(lastFlightQueueArrivalTime.getTime() + lastFlightQueue.max_layover_time); // calculate the maximum layover time left in milliseconds
        const flights = await client.query(query, [
          minLayoverTimeLeft,
          maxLayoverTimeLeft,
          lastFlightQueue.arrival_airport_id,
        ]);
        const nextFlights: IFlight[] = flights.rows;
        for (const nextFlight of nextFlights) {
          // add next flight to the queue
          if (visited.has(nextFlight.id)) {
            // if the next flight is already visited, then skip it
            continue;
          }
          const nextFlightQueueArray: IFlightQueue[] = [
            ...flightQueueArray,
            {
              ...nextFlight,
              hops: lastFlightQueue.hops - 1,
              min_layover_time: lastFlightQueue.min_layover_time,
              max_layover_time: lastFlightQueue.max_layover_time,
            },
          ];
          // push the updated flightQueueArray to the queue
          queue.push(nextFlightQueueArray);
          // remove the last flight from the flightQueueArray
        }
      }
      const flightPathFlightsDetailForUser: IFlightWithDetailsForUser[][] = [];
      for (const flightPath of flightRoute) {
        const flights: IFlightWithDetailsForUser[] = await Promise.all(
          flightPath.map(async (flightData) => {
            const flight: IFlightWithDetails = await queryFlightWithDetailById(flightData.id);
            const class_window_price: IClassWindowPrice = flight.class_window_price;
            const class_price_seats: IClassWindowPriceForUser = classPriceSeat(flight, class_window_price);
            return returnFlightForUser(flight, class_price_seats);
          }),
        );
        flightPathFlightsDetailForUser.push(flights);
      }
      return flightPathFlightsDetailForUser;
    } finally {
      await client.release();
    }
  }

  async getFlightByFlightNumber(flight_number: string): Promise<IFlightWithDetails> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = fetchFlightBy('flight_number');
      const result = await client.query(query, [flight_number]);
      const flight = result.rows[0];
      if (flight === undefined) {
        throw new ApiError(404, `Flight with number ${flight_number} not found`);
      }
      return returnFlight(flight, flight.class_window_price);
    } finally {
      await client.release();
    }
  }

  async updateFlightArrivalTime(id: string, arrival_time: Date): Promise<IFlightWithDetails> {
    const client: PoolClient = await this.pool.connect();
    try {
      let query = `UPDATE flights SET arrival_time = $1 WHERE id = $2`;
      await client.query(query, [arrival_time, id]);
      query = fetchFlightBy('id');
      const result = await client.query(query, [id]);
      const flight = result.rows[0];
      if (flight === undefined) {
        throw new ApiError(404, `Flight with id ${id} not found`);
      }
      return returnFlight(flight, flight.class_window_price);
    } finally {
      await client.release();
    }
  }

  async updateFlightDepartureTime(id: string, departure_time: Date): Promise<IFlightWithDetails> {
    const client: PoolClient = await this.pool.connect();
    try {
      let query = `UPDATE flights SET departure_time = $1 WHERE id = $2`;
      await client.query(query, [departure_time, id]);
      query = fetchFlightBy('id');
      const result = await client.query(query, [id]);
      const flight = result.rows[0];
      if (flight === undefined) {
        throw new ApiError(404, `Flight with id ${id} not found`);
      }
      return returnFlight(flight, flight.class_window_price);
    } finally {
      await client.release();
    }
  }

  async updateFlightStatus(id: string, status: IFlightStatus): Promise<IFlightWithDetails> {
    const client: PoolClient = await this.pool.connect();
    try {
      let query = fetchFlightBy('id');
      let result = await client.query(query, [id]);
      let flight = result.rows[0];
      if (flight === undefined) {
        throw new ApiError(404, `Flight with id ${id} not found`);
      }
      query = `UPDATE flights SET status = $1 WHERE id = $2 RETURNING *`;
      result = await client.query(query, [status, id]);
      flight = result.rows[0];
      return returnFlight(flight, flight.class_window_price);
    } finally {
      await client.release();
    }
  }

  async updateFlightPrice(id: string, price: number): Promise<IFlightWithDetails> {
    const client: PoolClient = await this.pool.connect();
    try {
      let query = fetchFlightBy('id');
      let result = await client.query(query, [id]);
      let flight = result.rows[0];
      if (flight === undefined) {
        throw new ApiError(404, `Flight with id ${id} not found`);
      }
      query = `UPDATE flights SET price = $1 WHERE id = $2 RETURNING *`;
      result = await client.query(query, [price, id]);
      flight = result.rows[0];
      return returnFlight(flight, flight.class_window_price);
    } finally {
      await client.release();
    }
  }

  async updateFlightDepartureAirport(id: string, departure_airport_id: string): Promise<IFlightWithDetails> {
    const client: PoolClient = await this.pool.connect();
    try {
      let query = fetchFlightBy('id');
      let result = await client.query(query, [id]);
      let flight = result.rows[0];
      if (flight === undefined) {
        throw new ApiError(404, `Flight with id ${id} not found`);
      }
      query = `UPDATE flights SET departure_airport_id = $1 WHERE id = $2 RETURNING *`;
      result = await client.query(query, [departure_airport_id, id]);
      flight = result.rows[0];
      return returnFlight(flight, flight.class_window_price);
    } finally {
      await client.release();
    }
  }

  async updateFlightArrivalAirport(id: string, arrival_airport_id: string): Promise<IFlightWithDetails> {
    const client: PoolClient = await this.pool.connect();
    try {
      let query = fetchFlightBy('id');
      let result = await client.query(query, [id]);
      let flight = result.rows[0];
      if (flight === undefined) {
        throw new ApiError(404, `Flight with id ${id} not found`);
      }
      query = `UPDATE flights SET arrival_airport_id = $1 WHERE id = $2 RETURNING *`;
      result = await client.query(query, [arrival_airport_id, id]);
      flight = result.rows[0];
      return returnFlight(flight, flight.class_window_price);
    } finally {
      await client.release();
    }
  }

  async updateFlightAirplane(id: string, airplane_id: string): Promise<IFlightWithDetails> {
    const client: PoolClient = await this.pool.connect();
    try {
      let query = fetchFlightBy('id');
      let result = await client.query(query, [id]);
      let flight = result.rows[0];
      if (flight === undefined) {
        throw new ApiError(404, `Flight with id ${id} not found`);
      }
      query = `UPDATE flights SET airplane_id = $1 WHERE id = $2 RETURNING *`;
      result = await client.query(query, [airplane_id, id]);
      flight = result.rows[0];
      return returnFlight(flight, flight.class_window_price);
    } finally {
      await client.release();
    }
  }

  async updateFlightWindowSeats(flight_id: string, window_type: IFlightWindow, seats: number): Promise<void> {
    const client: PoolClient = await this.pool.connect();
    try {
      let query = `SELECT * FROM flights WHERE id = $1`;
      const result = await client.query(query, [flight_id]);
      const flight: IFlight = result.rows[0];
      if (flight === undefined) {
        throw new ApiError(404, `Flight with id ${flight_id} not found`);
      }
      const flightWindow: IClassWindowPrice = flight.class_window_price;
      if (window_type === 'economy') {
        if (flightWindow[window_type].first_window_seats >= seats)
          flightWindow[window_type].first_window_seats -= seats;
        else if (flightWindow[window_type].second_window_seats >= seats)
          flightWindow[window_type].second_window_seats -= seats;
        else if (flightWindow[window_type].third_window_seats >= seats)
          flightWindow[window_type].third_window_seats -= seats;
        else throw new ApiError(400, `Not enough seats available for ${window_type} window type`);
      } else {
        if (flightWindow[window_type].first_window_seats >= seats)
          flightWindow[window_type].first_window_seats -= seats;
        else if (flightWindow[window_type].second_window_seats >= seats)
          flightWindow[window_type].second_window_seats -= seats;
        else throw new ApiError(400, `Not enough seats available for ${window_type} window type`);
      }
      query = `UPDATE flights SET class_window_price = $1 WHERE id = $2`;
      await client.query(query, [flightWindow, flight_id]);
    } finally {
      await client.release();
    }
  }

  async deleteFlight(id: string): Promise<void> {
    const client: PoolClient = await this.pool.connect();
    try {
      let query = `SELECT * FROM flights WHERE id = $1`;
      const result = await client.query(query, [id]);
      const flight: IFlight = result.rows[0];
      if (!flight) {
        throw new ApiError(404, `Flight with id ${id} not found`);
      }
      query = `DELETE FROM flights WHERE id = $1`;
      await client.query(query, [id]);
    } finally {
      await client.release();
    }
  }
}

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
        throw new Error(
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
      query = `SELECT f.*, 
              a.name AS airplane_name, a.capacity AS airplane_capacity, a.code AS airplane_code, a.created_at AS airplane_created_at, a.updated_at AS airplane_updated_at, 
              da.id AS departure_airport_id, da.name AS departure_airport_name, da.code AS departure_airport_code, da.city_id AS departure_airport_city_id, da.created_at AS departure_airport_created_at, da.updated_at AS departure_airport_updated_at, 
              aa.id AS arrival_airport_id, aa.name AS arrival_airport_name, aa.code AS arrival_airport_code, aa.city_id AS arrival_airport_city_id, aa.created_at AS arrival_airport_created_at, aa.updated_at AS arrival_airport_updated_at, 
              dac.id AS departure_airport_city_id, dac.name AS departure_airport_city_name, dac.country_id AS departure_airport_country_id, dac.created_at AS departure_airport_city_created_at, dac.updated_at AS departure_airport_city_updated_at, 
              aac.id AS arrival_airport_city_id, aac.name AS arrival_airport_city_name, aac.country_id AS arrival_airport_country_id, aac.created_at AS arrival_airport_city_created_at, aac.updated_at AS arrival_airport_city_updated_at, 
              daco.id AS departure_airport_country_id, daco.name AS departure_airport_country_name, daco.code AS departure_airport_country_code, daco.created_at AS departure_airport_country_created_at, daco.updated_at AS departure_airport_country_updated_at, 
              aaco.id AS arrival_airport_country_id, aaco.name AS arrival_airport_country_name, aaco.code AS arrival_airport_country_code, aaco.created_at AS arrival_airport_country_created_at, aaco.updated_at AS arrival_airport_country_updated_at
              FROM flights f
                INNER JOIN airplanes a ON f.airplane_id = a.id
                INNER JOIN airports da ON f.departure_airport_id = da.id
                INNER JOIN airports aa ON f.arrival_airport_id = aa.id
                INNER JOIN cities dac ON da.city_id = dac.id
                INNER JOIN cities aac ON aa.city_id = aac.id
                INNER JOIN countries daco ON dac.country_id = daco.id
                INNER JOIN countries aaco ON aac.country_id = aaco.id
              WHERE f.id = $1`;
      const result = await client.query(query, [flight_id]);
      const flight = result.rows[0];
      if (flight === null) {
        throw new Error(`Flight with id ${flight_id} not found`);
      }
      return {
        id: flight.id,
        flight_number: flight.flight_number,
        departure_time: flight.departure_time,
        arrival_time: flight.arrival_time,
        status: flight.status,
        price: flight.price,
        created_at: flight.created_at,
        updated_at: flight.updated_at,
        airplane: {
          id: flight.airplane_id,
          name: flight.airplane_name,
          capacity: flight.airplane_capacity,
          code: flight.airplane_code,
          created_at: flight.airplane_created_at,
          updated_at: flight.airplane_updated_at,
        },
        departure_airport: {
          id: flight.departure_airport_id,
          name: flight.departure_airport_name,
          code: flight.departure_airport_code,
          city: {
            id: flight.departure_airport_city_id,
            name: flight.departure_airport_city_name,
            country: {
              id: flight.departure_airport_country_id,
              name: flight.departure_airport_country_name,
              code: flight.departure_airport_country_code,
              created_at: flight.departure_airport_country_created_at,
              updated_at: flight.departure_airport_country_updated_at,
            },
            created_at: flight.departure_airport_city_created_at,
            updated_at: flight.departure_airport_city_updated_at,
          },
          created_at: flight.departure_airport_created_at,
          updated_at: flight.departure_airport_updated_at,
        },
        arrival_airport: {
          id: flight.arrival_airport_id,
          name: flight.arrival_airport_name,
          code: flight.arrival_airport_code,
          city: {
            id: flight.arrival_airport_city_id,
            name: flight.arrival_airport_city_name,
            country: {
              id: flight.arrival_airport_country_id,
              name: flight.arrival_airport_country_name,
              code: flight.arrival_airport_country_code,
              created_at: flight.arrival_airport_country_created_at,
              updated_at: flight.arrival_airport_country_updated_at,
            },
            created_at: flight.arrival_airport_city_created_at,
            updated_at: flight.arrival_airport_city_updated_at,
          },
          created_at: flight.arrival_airport_created_at,
          updated_at: flight.arrival_airport_updated_at,
        },
        class_window_price: data.class_window_price,
      };
    } catch (error) {
      console.log('Error in FlightRepository: createFlight:', error);
      throw error;
    } finally {
      await client.release();
    }
  }

  async getAllFlights(): Promise<IFlightWithDetails[]> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = `SELECT f.*, 
                    a.name AS airplane_name, a.capacity AS airplane_capacity, a.code AS airplane_code, a.created_at AS airplane_created_at, a.updated_at AS airplane_updated_at, 
                    da.id AS departure_airport_id, da.name AS departure_airport_name, da.code AS departure_airport_code, da.city_id AS departure_airport_city_id, da.created_at AS departure_airport_created_at, da.updated_at AS departure_airport_updated_at, 
                    aa.id AS arrival_airport_id, aa.name AS arrival_airport_name, aa.code AS arrival_airport_code, aa.city_id AS arrival_airport_city_id, aa.created_at AS arrival_airport_created_at, aa.updated_at AS arrival_airport_updated_at, 
                    dac.id AS departure_airport_city_id, dac.name AS departure_airport_city_name, dac.country_id AS departure_airport_country_id, dac.created_at AS departure_airport_city_created_at, dac.updated_at AS departure_airport_city_updated_at, 
                    aac.id AS arrival_airport_city_id, aac.name AS arrival_airport_city_name, aac.country_id AS arrival_airport_country_id, aac.created_at AS arrival_airport_city_created_at, aac.updated_at AS arrival_airport_city_updated_at, 
                    daco.id AS departure_airport_country_id, daco.name AS departure_airport_country_name, daco.code AS departure_airport_country_code, daco.created_at AS departure_airport_country_created_at, daco.updated_at AS departure_airport_country_updated_at, 
                    aaco.id AS arrival_airport_country_id, aaco.name AS arrival_airport_country_name, aaco.code AS arrival_airport_country_code, aaco.created_at AS arrival_airport_country_created_at, aaco.updated_at AS arrival_airport_country_updated_at
                    FROM flights f
                      INNER JOIN airplanes a ON f.airplane_id = a.id
                      INNER JOIN airports da ON f.departure_airport_id = da.id
                      INNER JOIN airports aa ON f.arrival_airport_id = aa.id
                      INNER JOIN cities dac ON da.city_id = dac.id
                      INNER JOIN cities aac ON aa.city_id = aac.id
                      INNER JOIN countries daco ON dac.country_id = daco.id
                      INNER JOIN countries aaco ON aac.country_id = aaco.id`;
      const result = await client.query(query);
      const flights = result.rows;
      return flights.map((flight) => {
        return {
          id: flight.id,
          flight_number: flight.flight_number,
          departure_time: flight.departure_time,
          arrival_time: flight.arrival_time,
          status: flight.status,
          price: flight.price,
          created_at: flight.created_at,
          updated_at: flight.updated_at,
          airplane: {
            id: flight.airplane_id,
            name: flight.airplane_name,
            capacity: flight.airplane_capacity,
            code: flight.airplane_code,
            created_at: flight.airplane_created_at,
            updated_at: flight.airplane_updated_at,
          },
          departure_airport: {
            id: flight.departure_airport_id,
            name: flight.departure_airport_name,
            code: flight.departure_airport_code,
            city: {
              id: flight.departure_airport_city_id,
              name: flight.departure_airport_city_name,
              country: {
                id: flight.departure_airport_country_id,
                name: flight.departure_airport_country_name,
                code: flight.departure_airport_country_code,
                created_at: flight.departure_airport_country_created_at,
                updated_at: flight.departure_airport_country_updated_at,
              },
              created_at: flight.departure_airport_city_created_at,
              updated_at: flight.departure_airport_city_updated_at,
            },
            created_at: flight.departure_airport_created_at,
            updated_at: flight.departure_airport_updated_at,
          },
          arrival_airport: {
            id: flight.arrival_airport_id,
            name: flight.arrival_airport_name,
            code: flight.arrival_airport_code,
            city: {
              id: flight.arrival_airport_city_id,
              name: flight.arrival_airport_city_name,
              country: {
                id: flight.arrival_airport_country_id,
                name: flight.arrival_airport_country_name,
                code: flight.arrival_airport_country_code,
                created_at: flight.arrival_airport_country_created_at,
                updated_at: flight.arrival_airport_country_updated_at,
              },
              created_at: flight.arrival_airport_city_created_at,
              updated_at: flight.arrival_airport_city_updated_at,
            },
            created_at: flight.arrival_airport_created_at,
            updated_at: flight.arrival_airport_updated_at,
          },
          class_window_price: flight.class_window_price,
        };
      });
    } catch (error) {
      console.log('Error in FlightRepository: getAllFlights:', error);
      throw error;
    } finally {
      await client.release();
    }
  }

  async getFlightByIdForAdmin(id: string): Promise<IFlightWithDetails> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = `SELECT f.*, 
                    a.name AS airplane_name, a.capacity AS airplane_capacity, a.code AS airplane_code, a.created_at AS airplane_created_at, a.updated_at AS airplane_updated_at, 
                    da.id AS departure_airport_id, da.name AS departure_airport_name, da.code AS departure_airport_code, da.city_id AS departure_airport_city_id, da.created_at AS departure_airport_created_at, da.updated_at AS departure_airport_updated_at, 
                    aa.id AS arrival_airport_id, aa.name AS arrival_airport_name, aa.code AS arrival_airport_code, aa.city_id AS arrival_airport_city_id, aa.created_at AS arrival_airport_created_at, aa.updated_at AS arrival_airport_updated_at, 
                    dac.id AS departure_airport_city_id, dac.name AS departure_airport_city_name, dac.country_id AS departure_airport_country_id, dac.created_at AS departure_airport_city_created_at, dac.updated_at AS departure_airport_city_updated_at, 
                    aac.id AS arrival_airport_city_id, aac.name AS arrival_airport_city_name, aac.country_id AS arrival_airport_country_id, aac.created_at AS arrival_airport_city_created_at, aac.updated_at AS arrival_airport_city_updated_at, 
                    daco.id AS departure_airport_country_id, daco.name AS departure_airport_country_name, daco.code AS departure_airport_country_code, daco.created_at AS departure_airport_country_created_at, daco.updated_at AS departure_airport_country_updated_at, 
                    aaco.id AS arrival_airport_country_id, aaco.name AS arrival_airport_country_name, aaco.code AS arrival_airport_country_code, aaco.created_at AS arrival_airport_country_created_at, aaco.updated_at AS arrival_airport_country_updated_at
                    FROM flights f
                      INNER JOIN airplanes a ON f.airplane_id = a.id
                      INNER JOIN airports da ON f.departure_airport_id = da.id
                      INNER JOIN airports aa ON f.arrival_airport_id = aa.id
                      INNER JOIN cities dac ON da.city_id = dac.id
                      INNER JOIN cities aac ON aa.city_id = aac.id
                      INNER JOIN countries daco ON dac.country_id = daco.id
                      INNER JOIN countries aaco ON aac.country_id = aaco.id
                    WHERE f.id = $1`;
      const result = await client.query(query, [id]);
      const flight = result.rows[0];
      if (flight === null) {
        throw new Error(`Flight with id ${id} not found`);
      }
      return {
        id: flight.id,
        flight_number: flight.flight_number,
        departure_time: flight.departure_time,
        arrival_time: flight.arrival_time,
        status: flight.status,
        price: flight.price,
        created_at: flight.created_at,
        updated_at: flight.updated_at,
        airplane: {
          id: flight.airplane_id,
          name: flight.airplane_name,
          capacity: flight.airplane_capacity,
          code: flight.airplane_code,
          created_at: flight.airplane_created_at,
          updated_at: flight.airplane_updated_at,
        },
        departure_airport: {
          id: flight.departure_airport_id,
          name: flight.departure_airport_name,
          code: flight.departure_airport_code,
          city: {
            id: flight.departure_airport_city_id,
            name: flight.departure_airport_city_name,
            country: {
              id: flight.departure_airport_country_id,
              name: flight.departure_airport_country_name,
              code: flight.departure_airport_country_code,
              created_at: flight.departure_airport_country_created_at,
              updated_at: flight.departure_airport_country_updated_at,
            },
            created_at: flight.departure_airport_city_created_at,
            updated_at: flight.departure_airport_city_updated_at,
          },
          created_at: flight.departure_airport_created_at,
          updated_at: flight.departure_airport_updated_at,
        },
        arrival_airport: {
          id: flight.arrival_airport_id,
          name: flight.arrival_airport_name,
          code: flight.arrival_airport_code,
          city: {
            id: flight.arrival_airport_city_id,
            name: flight.arrival_airport_city_name,
            country: {
              id: flight.arrival_airport_country_id,
              name: flight.arrival_airport_country_name,
              code: flight.arrival_airport_country_code,
              created_at: flight.arrival_airport_country_created_at,
              updated_at: flight.arrival_airport_country_updated_at,
            },
            created_at: flight.arrival_airport_city_created_at,
            updated_at: flight.arrival_airport_city_updated_at,
          },
          created_at: flight.arrival_airport_created_at,
          updated_at: flight.arrival_airport_updated_at,
        },
        class_window_price: flight.class_window_price,
      };
    } catch (error) {
      console.log('Error in FlightRepository: getFlightByIdForAdmin:', error);
      throw error;
    } finally {
      await client.release();
    }
  }

  async getFlightByIdForUser(id: string): Promise<IFlightWithDetailsForUser> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = `SELECT f.*, 
                    a.name AS airplane_name, a.capacity AS airplane_capacity, a.code AS airplane_code, a.created_at AS airplane_created_at, a.updated_at AS airplane_updated_at, 
                    da.id AS departure_airport_id, da.name AS departure_airport_name, da.code AS departure_airport_code, da.city_id AS departure_airport_city_id, da.created_at AS departure_airport_created_at, da.updated_at AS departure_airport_updated_at, 
                    aa.id AS arrival_airport_id, aa.name AS arrival_airport_name, aa.code AS arrival_airport_code, aa.city_id AS arrival_airport_city_id, aa.created_at AS arrival_airport_created_at, aa.updated_at AS arrival_airport_updated_at, 
                    dac.id AS departure_airport_city_id, dac.name AS departure_airport_city_name, dac.country_id AS departure_airport_country_id, dac.created_at AS departure_airport_city_created_at, dac.updated_at AS departure_airport_city_updated_at, 
                    aac.id AS arrival_airport_city_id, aac.name AS arrival_airport_city_name, aac.country_id AS arrival_airport_country_id, aac.created_at AS arrival_airport_city_created_at, aac.updated_at AS arrival_airport_city_updated_at, 
                    daco.id AS departure_airport_country_id, daco.name AS departure_airport_country_name, daco.code AS departure_airport_country_code, daco.created_at AS departure_airport_country_created_at, daco.updated_at AS departure_airport_country_updated_at, 
                    aaco.id AS arrival_airport_country_id, aaco.name AS arrival_airport_country_name, aaco.code AS arrival_airport_country_code, aaco.created_at AS arrival_airport_country_created_at, aaco.updated_at AS arrival_airport_country_updated_at
                    FROM flights f
                      INNER JOIN airplanes a ON f.airplane_id = a.id
                      INNER JOIN airports da ON f.departure_airport_id = da.id
                      INNER JOIN airports aa ON f.arrival_airport_id = aa.id
                      INNER JOIN cities dac ON da.city_id = dac.id
                      INNER JOIN cities aac ON aa.city_id = aac.id
                      INNER JOIN countries daco ON dac.country_id = daco.id
                      INNER JOIN countries aaco ON aac.country_id = aaco.id
                    WHERE f.id = $1`;
      const result = await client.query(query, [id]);
      const flight = result.rows[0];
      if (flight === null) {
        throw new Error(`Flight with id ${id} not found`);
      }
      const class_window_price: IClassWindowPrice = flight.class_window_price;
      const class_price_seats: IClassWindowPriceForUser = {
        business: {
          seats:
            class_window_price.business.first_window_seats > 0
              ? class_window_price.business.first_window_seats
              : class_window_price.business.second_window_seats,
          price:
            class_window_price.business.first_window_seats > 0
              ? class_window_price.business.first_window_percentage * flight.price
              : class_window_price.business.second_window_seats > 0
                ? class_window_price.business.second_window_percentage * flight.price
                : 0,
        },
        premium: {
          seats:
            class_window_price.premium.first_window_seats > 0
              ? class_window_price.premium.first_window_seats
              : class_window_price.premium.second_window_seats,
          price:
            class_window_price.premium.first_window_seats > 0
              ? class_window_price.premium.first_window_percentage * flight.price
              : class_window_price.premium.second_window_seats > 0
                ? class_window_price.premium.second_window_percentage * flight.price
                : 0,
        },
        economy: {
          seats:
            class_window_price.economy.first_window_seats > 0
              ? class_window_price.economy.first_window_seats
              : class_window_price.economy.second_window_seats > 0
                ? class_window_price.economy.second_window_seats
                : class_window_price.economy.third_window_seats,
          price:
            class_window_price.economy.first_window_seats > 0
              ? class_window_price.economy.first_window_percentage * flight.price
              : class_window_price.economy.second_window_seats > 0
                ? class_window_price.economy.second_window_percentage * flight.price
                : class_window_price.economy.third_window_seats > 0
                  ? class_window_price.economy.third_window_percentage * flight.price
                  : 0,
        },
      };
      return {
        id: flight.id,
        flight_number: flight.flight_number,
        departure_time: flight.departure_time,
        arrival_time: flight.arrival_time,
        status: flight.status,
        price: flight.price,
        created_at: flight.created_at,
        updated_at: flight.updated_at,
        airplane: {
          id: flight.airplane_id,
          name: flight.airplane_name,
          capacity: flight.airplane_capacity,
          code: flight.airplane_code,
          created_at: flight.airplane_created_at,
          updated_at: flight.airplane_updated_at,
        },
        departure_airport: {
          id: flight.departure_airport_id,
          name: flight.departure_airport_name,
          code: flight.departure_airport_code,
          city: {
            id: flight.departure_airport_city_id,
            name: flight.departure_airport_city_name,
            country: {
              id: flight.departure_airport_country_id,
              name: flight.departure_airport_country_name,
              code: flight.departure_airport_country_code,
              created_at: flight.departure_airport_country_created_at,
              updated_at: flight.departure_airport_country_updated_at,
            },
            created_at: flight.departure_airport_city_created_at,
            updated_at: flight.departure_airport_city_updated_at,
          },
          created_at: flight.departure_airport_created_at,
          updated_at: flight.departure_airport_updated_at,
        },
        arrival_airport: {
          id: flight.arrival_airport_id,
          name: flight.arrival_airport_name,
          code: flight.arrival_airport_code,
          city: {
            id: flight.arrival_airport_city_id,
            name: flight.arrival_airport_city_name,
            country: {
              id: flight.arrival_airport_country_id,
              name: flight.arrival_airport_country_name,
              code: flight.arrival_airport_country_code,
              created_at: flight.arrival_airport_country_created_at,
              updated_at: flight.arrival_airport_country_updated_at,
            },
            created_at: flight.arrival_airport_city_created_at,
            updated_at: flight.arrival_airport_city_updated_at,
          },
          created_at: flight.arrival_airport_created_at,
          updated_at: flight.arrival_airport_updated_at,
        },
        class_price_seats,
      };
    } catch (error) {
      console.log('Error in FlightRepository: getFlightByIdForUser:', error);
      throw error;
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
            const class_price_seats: IClassWindowPriceForUser = {
              business: {
                seats:
                  class_window_price.business.first_window_seats > 0
                    ? class_window_price.business.first_window_seats
                    : class_window_price.business.second_window_seats,
                price:
                  class_window_price.business.first_window_seats > 0
                    ? class_window_price.business.first_window_percentage * flight.price
                    : class_window_price.business.second_window_seats > 0
                      ? class_window_price.business.second_window_percentage * flight.price
                      : 0,
              },
              premium: {
                seats:
                  class_window_price.premium.first_window_seats > 0
                    ? class_window_price.premium.first_window_seats
                    : class_window_price.premium.second_window_seats,
                price:
                  class_window_price.premium.first_window_seats > 0
                    ? class_window_price.premium.first_window_percentage * flight.price
                    : class_window_price.premium.second_window_seats > 0
                      ? class_window_price.premium.second_window_percentage * flight.price
                      : 0,
              },
              economy: {
                seats:
                  class_window_price.economy.first_window_seats > 0
                    ? class_window_price.economy.first_window_seats
                    : class_window_price.economy.second_window_seats > 0
                      ? class_window_price.economy.second_window_seats
                      : class_window_price.economy.third_window_seats,
                price:
                  class_window_price.economy.first_window_seats > 0
                    ? class_window_price.economy.first_window_percentage * flight.price
                    : class_window_price.economy.second_window_seats > 0
                      ? class_window_price.economy.second_window_percentage * flight.price
                      : class_window_price.economy.third_window_seats > 0
                        ? class_window_price.economy.third_window_percentage * flight.price
                        : 0,
              },
            };
            return {
              id: flight.id,
              flight_number: flight.flight_number,
              departure_time: flight.departure_time,
              arrival_time: flight.arrival_time,
              status: flight.status,
              price: flight.price,
              created_at: flight.created_at,
              updated_at: flight.updated_at,
              airplane: {
                id: flight.airplane.id,
                name: flight.airplane.name,
                capacity: flight.airplane.capacity,
                code: flight.airplane.code,
                created_at: flight.airplane.created_at,
                updated_at: flight.airplane.updated_at,
              },
              departure_airport: {
                id: flight.departure_airport.id,
                name: flight.departure_airport.name,
                code: flight.departure_airport.code,
                city: {
                  id: flight.departure_airport.city.id,
                  name: flight.departure_airport.city.name,
                  country: {
                    id: flight.departure_airport.city.country.id,
                    name: flight.departure_airport.city.country.name,
                    code: flight.departure_airport.city.country.code,
                    created_at: flight.departure_airport.city.country.created_at,
                    updated_at: flight.departure_airport.city.country.updated_at,
                  },
                  created_at: flight.departure_airport.city.created_at,
                  updated_at: flight.departure_airport.city.updated_at,
                },
                created_at: flight.departure_airport.created_at,
                updated_at: flight.departure_airport.updated_at,
              },
              arrival_airport: {
                id: flight.arrival_airport.id,
                name: flight.arrival_airport.name,
                code: flight.arrival_airport.code,
                city: {
                  id: flight.arrival_airport.city.id,
                  name: flight.arrival_airport.city.name,
                  country: {
                    id: flight.arrival_airport.city.country.id,
                    name: flight.arrival_airport.city.country.name,
                    code: flight.arrival_airport.city.country.code,
                    created_at: flight.arrival_airport.city.country.created_at,
                    updated_at: flight.arrival_airport.city.country.updated_at,
                  },
                  created_at: flight.arrival_airport.city.created_at,
                  updated_at: flight.arrival_airport.city.updated_at,
                },
                created_at: flight.arrival_airport.created_at,
                updated_at: flight.arrival_airport.updated_at,
              },
              class_price_seats,
            };
          }),
        );
        flightPathFlightsDetailForUser.push(flights);
      }
      return flightPathFlightsDetailForUser;
    } catch (error) {
      console.log('Error in FlightRepository: getFlightByNumber:', error);
      throw error;
    } finally {
      await client.release();
    }
  }

  async getFlightByFlightNumber(flight_number: string): Promise<IFlightWithDetails> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = `SELECT f.*, 
                    a.name AS airplane_name, a.capacity AS airplane_capacity, a.code AS airplane_code, a.created_at AS airplane_created_at, a.updated_at AS airplane_updated_at, 
                    da.id AS departure_airport_id, da.name AS departure_airport_name, da.code AS departure_airport_code, da.city_id AS departure_airport_city_id, da.created_at AS departure_airport_created_at, da.updated_at AS departure_airport_updated_at, 
                    aa.id AS arrival_airport_id, aa.name AS arrival_airport_name, aa.code AS arrival_airport_code, aa.city_id AS arrival_airport_city_id, aa.created_at AS arrival_airport_created_at, aa.updated_at AS arrival_airport_updated_at, 
                    dac.id AS departure_airport_city_id, dac.name AS departure_airport_city_name, dac.country_id AS departure_airport_country_id, dac.created_at AS departure_airport_city_created_at, dac.updated_at AS departure_airport_city_updated_at, 
                    aac.id AS arrival_airport_city_id, aac.name AS arrival_airport_city_name, aac.country_id AS arrival_airport_country_id, aac.created_at AS arrival_airport_city_created_at, aac.updated_at AS arrival_airport_city_updated_at, 
                    daco.id AS departure_airport_country_id, daco.name AS departure_airport_country_name, daco.code AS departure_airport_country_code, daco.created_at AS departure_airport_country_created_at, daco.updated_at AS departure_airport_country_updated_at, 
                    aaco.id AS arrival_airport_country_id, aaco.name AS arrival_airport_country_name, aaco.code AS arrival_airport_country_code, aaco.created_at AS arrival_airport_country_created_at, aaco.updated_at AS arrival_airport_country_updated_at
                      FROM flights f
                        INNER JOIN airplanes a ON f.airplane_id = a.id
                        INNER JOIN airports da ON f.departure_airport_id = da.id
                        INNER JOIN airports aa ON f.arrival_airport_id = aa.id
                        INNER JOIN cities dac ON da.city_id = dac.id
                        INNER JOIN cities aac ON aa.city_id = aac.id
                        INNER JOIN countries daco ON dac.country_id = daco.id
                        INNER JOIN countries aaco ON aac.country_id = aaco.id
                      WHERE f.flight_number = $1`;
      const result = await client.query(query, [flight_number]);
      const flight = result.rows[0];
      if (flight === null) {
        throw new Error(`Flight with number ${flight_number} not found`);
      }
      return {
        id: flight.id,
        flight_number: flight.flight_number,
        departure_time: flight.departure_time,
        arrival_time: flight.arrival_time,
        status: flight.status,
        price: flight.price,
        created_at: flight.created_at,
        updated_at: flight.updated_at,
        airplane: {
          id: flight.airplane_id,
          name: flight.airplane_name,
          capacity: flight.airplane_capacity,
          code: flight.airplane_code,
          created_at: flight.airplane_created_at,
          updated_at: flight.airplane_updated_at,
        },
        departure_airport: {
          id: flight.departure_airport_id,
          name: flight.departure_airport_name,
          code: flight.departure_airport_code,
          city: {
            id: flight.departure_airport_city_id,
            name: flight.departure_airport_city_name,
            country: {
              id: flight.departure_airport_country_id,
              name: flight.departure_airport_country_name,
              code: flight.departure_airport_country_code,
              created_at: flight.departure_airport_country_created_at,
              updated_at: flight.departure_airport_country_updated_at,
            },
            created_at: flight.departure_airport_city_created_at,
            updated_at: flight.departure_airport_city_updated_at,
          },
          created_at: flight.departure_airport_created_at,
          updated_at: flight.departure_airport_updated_at,
        },
        arrival_airport: {
          id: flight.arrival_airport_id,
          name: flight.arrival_airport_name,
          code: flight.arrival_airport_code,
          city: {
            id: flight.arrival_airport_city_id,
            name: flight.arrival_airport_city_name,
            country: {
              id: flight.arrival_airport_country_id,
              name: flight.arrival_airport_country_name,
              code: flight.arrival_airport_country_code,
              created_at: flight.arrival_airport_country_created_at,
              updated_at: flight.arrival_airport_country_updated_at,
            },
            created_at: flight.arrival_airport_city_created_at,
            updated_at: flight.arrival_airport_city_updated_at,
          },
          created_at: flight.arrival_airport_created_at,
          updated_at: flight.arrival_airport_updated_at,
        },
        class_window_price: flight.class_window_price,
      };
    } catch (error) {
      console.log('Error in FlightRepository: getFlightByNumber:', error);
      throw error;
    } finally {
      await client.release();
    }
  }

  async updateFlightArrivalTime(id: string, arrival_time: Date): Promise<IFlightWithDetails> {
    const client: PoolClient = await this.pool.connect();
    try {
      let query = `UPDATE flights SET arrival_time = $1 WHERE id = $2`;
      await client.query(query, [arrival_time, id]);
      query = `SELECT f.*, 
              a.name AS airplane_name, a.capacity AS airplane_capacity, a.code AS airplane_code, a.created_at AS airplane_created_at, a.updated_at AS airplane_updated_at, 
              da.id AS departure_airport_id, da.name AS departure_airport_name, da.code AS departure_airport_code, da.city_id AS departure_airport_city_id, da.created_at AS departure_airport_created_at, da.updated_at AS departure_airport_updated_at, 
              aa.id AS arrival_airport_id, aa.name AS arrival_airport_name, aa.code AS arrival_airport_code, aa.city_id AS arrival_airport_city_id, aa.created_at AS arrival_airport_created_at, aa.updated_at AS arrival_airport_updated_at, 
              dac.id AS departure_airport_city_id, dac.name AS departure_airport_city_name, dac.country_id AS departure_airport_country_id, dac.created_at AS departure_airport_city_created_at, dac.updated_at AS departure_airport_city_updated_at, 
              aac.id AS arrival_airport_city_id, aac.name AS arrival_airport_city_name, aac.country_id AS arrival_airport_country_id, aac.created_at AS arrival_airport_city_created_at, aac.updated_at AS arrival_airport_city_updated_at, 
              daco.id AS departure_airport_country_id, daco.name AS departure_airport_country_name, daco.code AS departure_airport_country_code, daco.created_at AS departure_airport_country_created_at, daco.updated_at AS departure_airport_country_updated_at, 
              aaco.id AS arrival_airport_country_id, aaco.name AS arrival_airport_country_name, aaco.code AS arrival_airport_country_code, aaco.created_at AS arrival_airport_country_created_at, aaco.updated_at AS arrival_airport_country_updated_at
                FROM flights f
                  INNER JOIN airplanes a ON f.airplane_id = a.id
                  INNER JOIN airports da ON f.departure_airport_id = da.id
                  INNER JOIN airports aa ON f.arrival_airport_id = aa.id
                  INNER JOIN cities dac ON da.city_id = dac.id
                  INNER JOIN cities aac ON aa.city_id = aac.id
                  INNER JOIN countries daco ON dac.country_id = daco.id
                  INNER JOIN countries aaco ON aac.country_id = aaco.id
                WHERE f.id = $1`;
      const result = await client.query(query, [id]);
      const flight = result.rows[0];
      if (flight === null) {
        throw new Error(`Flight with id ${id} not found`);
      }
      return {
        id: flight.id,
        flight_number: flight.flight_number,
        departure_time: flight.departure_time,
        arrival_time: flight.arrival_time,
        status: flight.status,
        price: flight.price,
        created_at: flight.created_at,
        updated_at: flight.updated_at,
        airplane: {
          id: flight.airplane_id,
          name: flight.airplane_name,
          capacity: flight.airplane_capacity,
          code: flight.airplane_code,
          created_at: flight.airplane_created_at,
          updated_at: flight.airplane_updated_at,
        },
        departure_airport: {
          id: flight.departure_airport_id,
          name: flight.departure_airport_name,
          code: flight.departure_airport_code,
          city: {
            id: flight.departure_airport_city_id,
            name: flight.departure_airport_city_name,
            country: {
              id: flight.departure_airport_country_id,
              name: flight.departure_airport_country_name,
              code: flight.departure_airport_country_code,
              created_at: flight.departure_airport_country_created_at,
              updated_at: flight.departure_airport_country_updated_at,
            },
            created_at: flight.departure_airport_city_created_at,
            updated_at: flight.departure_airport_city_updated_at,
          },
          created_at: flight.departure_airport_created_at,
          updated_at: flight.departure_airport_updated_at,
        },
        arrival_airport: {
          id: flight.arrival_airport_id,
          name: flight.arrival_airport_name,
          code: flight.arrival_airport_code,
          city: {
            id: flight.arrival_airport_city_id,
            name: flight.arrival_airport_city_name,
            country: {
              id: flight.arrival_airport_country_id,
              name: flight.arrival_airport_country_name,
              code: flight.arrival_airport_country_code,
              created_at: flight.arrival_airport_country_created_at,
              updated_at: flight.arrival_airport_country_updated_at,
            },
            created_at: flight.arrival_airport_city_created_at,
            updated_at: flight.arrival_airport_city_updated_at,
          },
          created_at: flight.arrival_airport_created_at,
          updated_at: flight.arrival_airport_updated_at,
        },
        class_window_price: flight.class_window_price,
      };
    } catch (error) {
      console.log('Error in FlightRepository: updateArrivalTime:', error);
      throw error;
    } finally {
      await client.release();
    }
  }

  async updateFlightDepartureTime(id: string, departure_time: Date): Promise<IFlightWithDetails> {
    const client: PoolClient = await this.pool.connect();
    try {
      let query = `UPDATE flights SET departure_time = $1 WHERE id = $2`;
      await client.query(query, [departure_time, id]);
      query = `SELECT f.*, 
              a.name AS airplane_name, a.capacity AS airplane_capacity, a.code AS airplane_code, a.created_at AS airplane_created_at, a.updated_at AS airplane_updated_at, 
              da.id AS departure_airport_id, da.name AS departure_airport_name, da.code AS departure_airport_code, da.city_id AS departure_airport_city_id, da.created_at AS departure_airport_created_at, da.updated_at AS departure_airport_updated_at, 
              aa.id AS arrival_airport_id, aa.name AS arrival_airport_name, aa.code AS arrival_airport_code, aa.city_id AS arrival_airport_city_id, aa.created_at AS arrival_airport_created_at, aa.updated_at AS arrival_airport_updated_at, 
              dac.id AS departure_airport_city_id, dac.name AS departure_airport_city_name, dac.country_id AS departure_airport_country_id, dac.created_at AS departure_airport_city_created_at, dac.updated_at AS departure_airport_city_updated_at, 
              aac.id AS arrival_airport_city_id, aac.name AS arrival_airport_city_name, aac.country_id AS arrival_airport_country_id, aac.created_at AS arrival_airport_city_created_at, aac.updated_at AS arrival_airport_city_updated_at, 
              daco.id AS departure_airport_country_id, daco.name AS departure_airport_country_name, daco.code AS departure_airport_country_code, daco.created_at AS departure_airport_country_created_at, daco.updated_at AS departure_airport_country_updated_at, 
              aaco.id AS arrival_airport_country_id, aaco.name AS arrival_airport_country_name, aaco.code AS arrival_airport_country_code, aaco.created_at AS arrival_airport_country_created_at, aaco.updated_at AS arrival_airport_country_updated_at
              FROM flights f
                INNER JOIN airplanes a ON f.airplane_id = a.id
                INNER JOIN airports da ON f.departure_airport_id = da.id
                INNER JOIN airports aa ON f.arrival_airport_id = aa.id
                INNER JOIN cities dac ON da.city_id = dac.id
                INNER JOIN cities aac ON aa.city_id = aac.id
                INNER JOIN countries daco ON dac.country_id = daco.id
                INNER JOIN countries aaco ON aac.country_id = aaco.id
              WHERE f.id = $1`;
      const result = await client.query(query, [id]);
      const flight = result.rows[0];
      if (flight === null) {
        throw new Error(`Flight with id ${id} not found`);
      }
      return {
        id: flight.id,
        flight_number: flight.flight_number,
        departure_time: flight.departure_time,
        arrival_time: flight.arrival_time,
        status: flight.status,
        price: flight.price,
        created_at: flight.created_at,
        updated_at: flight.updated_at,
        airplane: {
          id: flight.airplane_id,
          name: flight.airplane_name,
          capacity: flight.airplane_capacity,
          code: flight.airplane_code,
          created_at: flight.airplane_created_at,
          updated_at: flight.airplane_updated_at,
        },
        departure_airport: {
          id: flight.departure_airport_id,
          name: flight.departure_airport_name,
          code: flight.departure_airport_code,
          city: {
            id: flight.departure_airport_city_id,
            name: flight.departure_airport_city_name,
            country: {
              id: flight.departure_airport_country_id,
              name: flight.departure_airport_country_name,
              code: flight.departure_airport_country_code,
              created_at: flight.departure_airport_country_created_at,
              updated_at: flight.departure_airport_country_updated_at,
            },
            created_at: flight.departure_airport_city_created_at,
            updated_at: flight.departure_airport_city_updated_at,
          },
          created_at: flight.departure_airport_created_at,
          updated_at: flight.departure_airport_updated_at,
        },
        arrival_airport: {
          id: flight.arrival_airport_id,
          name: flight.arrival_airport_name,
          code: flight.arrival_airport_code,
          city: {
            id: flight.arrival_airport_city_id,
            name: flight.arrival_airport_city_name,
            country: {
              id: flight.arrival_airport_country_id,
              name: flight.arrival_airport_country_name,
              code: flight.arrival_airport_country_code,
              created_at: flight.arrival_airport_country_created_at,
              updated_at: flight.arrival_airport_country_updated_at,
            },
            created_at: flight.arrival_airport_city_created_at,
            updated_at: flight.arrival_airport_city_updated_at,
          },
          created_at: flight.arrival_airport_created_at,
          updated_at: flight.arrival_airport_updated_at,
        },
        class_window_price: flight.class_window_price,
      };
    } catch (error) {
      console.log('Error in FlightRepository: updateDepartureTime:', error);
      throw error;
    } finally {
      await client.release();
    }
  }

  async updateFlightStatus(id: string, status: IFlightStatus): Promise<IFlightWithDetails> {
    const client: PoolClient = await this.pool.connect();
    try {
      let query = `UPDATE flights SET status = $1 WHERE id = $2`;
      await client.query(query, [status, id]);
      query = `SELECT f.*, 
              a.name AS airplane_name, a.capacity AS airplane_capacity, a.code AS airplane_code, a.created_at AS airplane_created_at, a.updated_at AS airplane_updated_at, 
              da.id AS departure_airport_id, da.name AS departure_airport_name, da.code AS departure_airport_code, da.city_id AS departure_airport_city_id, da.created_at AS departure_airport_created_at, da.updated_at AS departure_airport_updated_at, 
              aa.id AS arrival_airport_id, aa.name AS arrival_airport_name, aa.code AS arrival_airport_code, aa.city_id AS arrival_airport_city_id, aa.created_at AS arrival_airport_created_at, aa.updated_at AS arrival_airport_updated_at, 
              dac.id AS departure_airport_city_id, dac.name AS departure_airport_city_name, dac.country_id AS departure_airport_country_id, dac.created_at AS departure_airport_city_created_at, dac.updated_at AS departure_airport_city_updated_at, 
              aac.id AS arrival_airport_city_id, aac.name AS arrival_airport_city_name, aac.country_id AS arrival_airport_country_id, aac.created_at AS arrival_airport_city_created_at, aac.updated_at AS arrival_airport_city_updated_at, 
              daco.id AS departure_airport_country_id, daco.name AS departure_airport_country_name, daco.code AS departure_airport_country_code, daco.created_at AS departure_airport_country_created_at, daco.updated_at AS departure_airport_country_updated_at, 
              aaco.id AS arrival_airport_country_id, aaco.name AS arrival_airport_country_name, aaco.code AS arrival_airport_country_code, aaco.created_at AS arrival_airport_country_created_at, aaco.updated_at AS arrival_airport_country_updated_at
              FROM flights f
              INNER JOIN airplanes a ON f.airplane_id = a.id
              INNER JOIN airports da ON f.departure_airport_id = da.id
              INNER JOIN airports aa ON f.arrival_airport_id = aa.id
              INNER JOIN cities dac ON da.city_id = dac.id
              INNER JOIN cities aac ON aa.city_id = aac.id
              INNER JOIN countries daco ON dac.country_id = daco.id
              INNER JOIN countries aaco ON aac.country_id = aaco.id
              WHERE f.id = $1`;
      const result = await client.query(query, [id]);
      const flight = result.rows[0];
      if (flight === null) {
        throw new Error(`Flight with id ${id} not found`);
      }
      return {
        id: flight.id,
        flight_number: flight.flight_number,
        departure_time: flight.departure_time,
        arrival_time: flight.arrival_time,
        status: flight.status,
        price: flight.price,
        created_at: flight.created_at,
        updated_at: flight.updated_at,
        airplane: {
          id: flight.airplane_id,
          name: flight.airplane_name,
          capacity: flight.airplane_capacity,
          code: flight.airplane_code,
          created_at: flight.airplane_created_at,
          updated_at: flight.airplane_updated_at,
        },
        departure_airport: {
          id: flight.departure_airport_id,
          name: flight.departure_airport_name,
          code: flight.departure_airport_code,
          city: {
            id: flight.departure_airport_city_id,
            name: flight.departure_airport_city_name,
            country: {
              id: flight.departure_airport_country_id,
              name: flight.departure_airport_country_name,
              code: flight.departure_airport_country_code,
              created_at: flight.departure_airport_country_created_at,
              updated_at: flight.departure_airport_country_updated_at,
            },
            created_at: flight.departure_airport_city_created_at,
            updated_at: flight.departure_airport_city_updated_at,
          },
          created_at: flight.departure_airport_created_at,
          updated_at: flight.departure_airport_updated_at,
        },
        arrival_airport: {
          id: flight.arrival_airport_id,
          name: flight.arrival_airport_name,
          code: flight.arrival_airport_code,
          city: {
            id: flight.arrival_airport_city_id,
            name: flight.arrival_airport_city_name,
            country: {
              id: flight.arrival_airport_country_id,
              name: flight.arrival_airport_country_name,
              code: flight.arrival_airport_country_code,
              created_at: flight.arrival_airport_country_created_at,
              updated_at: flight.arrival_airport_country_updated_at,
            },
            created_at: flight.arrival_airport_city_created_at,
            updated_at: flight.arrival_airport_city_updated_at,
          },
          created_at: flight.arrival_airport_created_at,
          updated_at: flight.arrival_airport_updated_at,
        },
        class_window_price: flight.class_window_price,
      };
    } catch (error) {
      console.log('Error in FlightRepository: updateFlightStatus:', error);
      throw error;
    } finally {
      await client.release();
    }
  }

  async updateFlightPrice(id: string, price: number): Promise<IFlightWithDetails> {
    const client: PoolClient = await this.pool.connect();
    try {
      let query = `UPDATE flights SET price = $1 WHERE id = $2`;
      await client.query(query, [price, id]);
      query = `SELECT f.*, 
              a.name AS airplane_name, a.capacity AS airplane_capacity, a.code AS airplane_code, a.created_at AS airplane_created_at, a.updated_at AS airplane_updated_at, 
              da.id AS departure_airport_id, da.name AS departure_airport_name, da.code AS departure_airport_code, da.city_id AS departure_airport_city_id, da.created_at AS departure_airport_created_at, da.updated_at AS departure_airport_updated_at, 
              aa.id AS arrival_airport_id, aa.name AS arrival_airport_name, aa.code AS arrival_airport_code, aa.city_id AS arrival_airport_city_id, aa.created_at AS arrival_airport_created_at, aa.updated_at AS arrival_airport_updated_at, 
              dac.id AS departure_airport_city_id, dac.name AS departure_airport_city_name, dac.country_id AS departure_airport_country_id, dac.created_at AS departure_airport_city_created_at, dac.updated_at AS departure_airport_city_updated_at, 
              aac.id AS arrival_airport_city_id, aac.name AS arrival_airport_city_name, aac.country_id AS arrival_airport_country_id, aac.created_at AS arrival_airport_city_created_at, aac.updated_at AS arrival_airport_city_updated_at, 
              daco.id AS departure_airport_country_id, daco.name AS departure_airport_country_name, daco.code AS departure_airport_country_code, daco.created_at AS departure_airport_country_created_at, daco.updated_at AS departure_airport_country_updated_at, 
              aaco.id AS arrival_airport_country_id, aaco.name AS arrival_airport_country_name, aaco.code AS arrival_airport_country_code, aaco.created_at AS arrival_airport_country_created_at, aaco.updated_at AS arrival_airport_country_updated_at
                FROM flights f
                  INNER JOIN airplanes a ON f.airplane_id = a.id
                  INNER JOIN airports da ON f.departure_airport_id = da.id
                  INNER JOIN airports aa ON f.arrival_airport_id = aa.id
                  INNER JOIN cities dac ON da.city_id = dac.id
                  INNER JOIN cities aac ON aa.city_id = aac.id
                  INNER JOIN countries daco ON dac.country_id = daco.id
                  INNER JOIN countries aaco ON aac.country_id = aaco.id
                WHERE f.id = $1`;
      const result = await client.query(query, [id]);
      const flight = result.rows[0];
      if (flight === null) {
        throw new Error(`Flight with id ${id} not found`);
      }
      return {
        id: flight.id,
        flight_number: flight.flight_number,
        departure_time: flight.departure_time,
        arrival_time: flight.arrival_time,
        status: flight.status,
        price: flight.price,
        created_at: flight.created_at,
        updated_at: flight.updated_at,
        airplane: {
          id: flight.airplane_id,
          name: flight.airplane_name,
          capacity: flight.airplane_capacity,
          code: flight.airplane_code,
          created_at: flight.airplane_created_at,
          updated_at: flight.airplane_updated_at,
        },
        departure_airport: {
          id: flight.departure_airport_id,
          name: flight.departure_airport_name,
          code: flight.departure_airport_code,
          city: {
            id: flight.departure_airport_city_id,
            name: flight.departure_airport_city_name,
            country: {
              id: flight.departure_airport_country_id,
              name: flight.departure_airport_country_name,
              code: flight.departure_airport_country_code,
              created_at: flight.departure_airport_country_created_at,
              updated_at: flight.departure_airport_country_updated_at,
            },
            created_at: flight.departure_airport_city_created_at,
            updated_at: flight.departure_airport_city_updated_at,
          },
          created_at: flight.departure_airport_created_at,
          updated_at: flight.departure_airport_updated_at,
        },
        arrival_airport: {
          id: flight.arrival_airport_id,
          name: flight.arrival_airport_name,
          code: flight.arrival_airport_code,
          city: {
            id: flight.arrival_airport_city_id,
            name: flight.arrival_airport_city_name,
            country: {
              id: flight.arrival_airport_country_id,
              name: flight.arrival_airport_country_name,
              code: flight.arrival_airport_country_code,
              created_at: flight.arrival_airport_country_created_at,
              updated_at: flight.arrival_airport_country_updated_at,
            },
            created_at: flight.arrival_airport_city_created_at,
            updated_at: flight.arrival_airport_city_updated_at,
          },
          created_at: flight.arrival_airport_created_at,
          updated_at: flight.arrival_airport_updated_at,
        },
        class_window_price: flight.class_window_price,
      };
    } catch (error) {
      console.log('Error in FlightRepository: updateFlightPrice:', error);
      throw error;
    } finally {
      await client.release();
    }
  }

  async updateFlightDepartureAirport(id: string, departure_airport_id: string): Promise<IFlightWithDetails> {
    const client: PoolClient = await this.pool.connect();
    try {
      let query = `UPDATE flights SET departure_airport_id = $1 WHERE id = $2`;
      await client.query(query, [departure_airport_id, id]);
      query = `SELECT f.*, 
              a.name AS airplane_name, a.capacity AS airplane_capacity, a.code AS airplane_code, a.created_at AS airplane_created_at, a.updated_at AS airplane_updated_at, 
              da.id AS departure_airport_id, da.name AS departure_airport_name, da.code AS departure_airport_code, da.city_id AS departure_airport_city_id, da.created_at AS departure_airport_created_at, da.updated_at AS departure_airport_updated_at, 
              aa.id AS arrival_airport_id, aa.name AS arrival_airport_name, aa.code AS arrival_airport_code, aa.city_id AS arrival_airport_city_id, aa.created_at AS arrival_airport_created_at, aa.updated_at AS arrival_airport_updated_at, 
              dac.id AS departure_airport_city_id, dac.name AS departure_airport_city_name, dac.country_id AS departure_airport_country_id, dac.created_at AS departure_airport_city_created_at, dac.updated_at AS departure_airport_city_updated_at, 
              aac.id AS arrival_airport_city_id, aac.name AS arrival_airport_city_name, aac.country_id AS arrival_airport_country_id, aac.created_at AS arrival_airport_city_created_at, aac.updated_at AS arrival_airport_city_updated_at, 
              daco.id AS departure_airport_country_id, daco.name AS departure_airport_country_name, daco.code AS departure_airport_country_code, daco.created_at AS departure_airport_country_created_at, daco.updated_at AS departure_airport_country_updated_at, 
              aaco.id AS arrival_airport_country_id, aaco.name AS arrival_airport_country_name, aaco.code AS arrival_airport_country_code, aaco.created_at AS arrival_airport_country_created_at, aaco.updated_at AS arrival_airport_country_updated_at
                FROM flights f
                  INNER JOIN airplanes a ON f.airplane_id = a.id
                  INNER JOIN airports da ON f.departure_airport_id = da.id
                  INNER JOIN airports aa ON f.arrival_airport_id = aa.id
                  INNER JOIN cities dac ON da.city_id = dac.id
                  INNER JOIN cities aac ON aa.city_id = aac.id
                  INNER JOIN countries daco ON dac.country_id = daco.id
                  INNER JOIN countries aaco ON aac.country_id = aaco.id
                WHERE f.id = $1`;
      const result = await client.query(query, [id]);
      const flight = result.rows[0];
      if (flight === null) {
        throw new Error(`Flight with id ${id} not found`);
      }
      return {
        id: flight.id,
        flight_number: flight.flight_number,
        departure_time: flight.departure_time,
        arrival_time: flight.arrival_time,
        status: flight.status,
        price: flight.price,
        created_at: flight.created_at,
        updated_at: flight.updated_at,
        airplane: {
          id: flight.airplane_id,
          name: flight.airplane_name,
          capacity: flight.airplane_capacity,
          code: flight.airplane_code,
          created_at: flight.airplane_created_at,
          updated_at: flight.airplane_updated_at,
        },
        departure_airport: {
          id: flight.departure_airport_id,
          name: flight.departure_airport_name,
          code: flight.departure_airport_code,
          city: {
            id: flight.departure_airport_city_id,
            name: flight.departure_airport_city_name,
            country: {
              id: flight.departure_airport_country_id,
              name: flight.departure_airport_country_name,
              code: flight.departure_airport_country_code,
              created_at: flight.departure_airport_country_created_at,
              updated_at: flight.departure_airport_country_updated_at,
            },
            created_at: flight.departure_airport_city_created_at,
            updated_at: flight.departure_airport_city_updated_at,
          },
          created_at: flight.departure_airport_created_at,
          updated_at: flight.departure_airport_updated_at,
        },
        arrival_airport: {
          id: flight.arrival_airport_id,
          name: flight.arrival_airport_name,
          code: flight.arrival_airport_code,
          city: {
            id: flight.arrival_airport_city_id,
            name: flight.arrival_airport_city_name,
            country: {
              id: flight.arrival_airport_country_id,
              name: flight.arrival_airport_country_name,
              code: flight.arrival_airport_country_code,
              created_at: flight.arrival_airport_country_created_at,
              updated_at: flight.arrival_airport_country_updated_at,
            },
            created_at: flight.arrival_airport_city_created_at,
            updated_at: flight.arrival_airport_city_updated_at,
          },
          created_at: flight.arrival_airport_created_at,
          updated_at: flight.arrival_airport_updated_at,
        },
        class_window_price: flight.class_window_price,
      };
    } catch (error) {
      console.log('Error in FlightRepository: updateDepartureAirport:', error);
      throw error;
    } finally {
      await client.release();
    }
  }

  async updateFlightArrivalAirport(id: string, arrival_airport_id: string): Promise<IFlightWithDetails> {
    const client: PoolClient = await this.pool.connect();
    try {
      let query = `UPDATE flights SET arrival_airport_id = $1 WHERE id = $2`;
      await client.query(query, [arrival_airport_id, id]);
      query = `SELECT f.*, 
              a.name AS airplane_name, a.capacity AS airplane_capacity, a.code AS airplane_code, a.created_at AS airplane_created_at, a.updated_at AS airplane_updated_at, 
              da.id AS departure_airport_id, da.name AS departure_airport_name, da.code AS departure_airport_code, da.city_id AS departure_airport_city_id, da.created_at AS departure_airport_created_at, da.updated_at AS departure_airport_updated_at, 
              aa.id AS arrival_airport_id, aa.name AS arrival_airport_name, aa.code AS arrival_airport_code, aa.city_id AS arrival_airport_city_id, aa.created_at AS arrival_airport_created_at, aa.updated_at AS arrival_airport_updated_at, 
              dac.id AS departure_airport_city_id, dac.name AS departure_airport_city_name, dac.country_id AS departure_airport_country_id, dac.created_at AS departure_airport_city_created_at, dac.updated_at AS departure_airport_city_updated_at, 
              aac.id AS arrival_airport_city_id, aac.name AS arrival_airport_city_name, aac.country_id AS arrival_airport_country_id, aac.created_at AS arrival_airport_city_created_at, aac.updated_at AS arrival_airport_city_updated_at, 
              daco.id AS departure_airport_country_id, daco.name AS departure_airport_country_name, daco.code AS departure_airport_country_code, daco.created_at AS departure_airport_country_created_at, daco.updated_at AS departure_airport_country_updated_at, 
              aaco.id AS arrival_airport_country_id, aaco.name AS arrival_airport_country_name, aaco.code AS arrival_airport_country_code, aaco.created_at AS arrival_airport_country_created_at, aaco.updated_at AS arrival_airport_country_updated_at
                FROM flights f
                  INNER JOIN airplanes a ON f.airplane_id = a.id
                  INNER JOIN airports da ON f.departure_airport_id = da.id
                  INNER JOIN airports aa ON f.arrival_airport_id = aa.id
                  INNER JOIN cities dac ON da.city_id = dac.id
                  INNER JOIN cities aac ON aa.city_id = aac.id
                  INNER JOIN countries daco ON dac.country_id = daco.id
                  INNER JOIN countries aaco ON aac.country_id = aaco.id
                WHERE f.id = $1`;
      const result = await client.query(query, [id]);
      const flight = result.rows[0];
      if (flight === null) {
        throw new Error(`Flight with id ${id} not found`);
      }
      return {
        id: flight.id,
        flight_number: flight.flight_number,
        departure_time: flight.departure_time,
        arrival_time: flight.arrival_time,
        status: flight.status,
        price: flight.price,
        created_at: flight.created_at,
        updated_at: flight.updated_at,
        airplane: {
          id: flight.airplane_id,
          name: flight.airplane_name,
          capacity: flight.airplane_capacity,
          code: flight.airplane_code,
          created_at: flight.airplane_created_at,
          updated_at: flight.airplane_updated_at,
        },
        departure_airport: {
          id: flight.departure_airport_id,
          name: flight.departure_airport_name,
          code: flight.departure_airport_code,
          city: {
            id: flight.departure_airport_city_id,
            name: flight.departure_airport_city_name,
            country: {
              id: flight.departure_airport_country_id,
              name: flight.departure_airport_country_name,
              code: flight.departure_airport_country_code,
              created_at: flight.departure_airport_country_created_at,
              updated_at: flight.departure_airport_country_updated_at,
            },
            created_at: flight.departure_airport_city_created_at,
            updated_at: flight.departure_airport_city_updated_at,
          },
          created_at: flight.departure_airport_created_at,
          updated_at: flight.departure_airport_updated_at,
        },
        arrival_airport: {
          id: flight.arrival_airport_id,
          name: flight.arrival_airport_name,
          code: flight.arrival_airport_code,
          city: {
            id: flight.arrival_airport_city_id,
            name: flight.arrival_airport_city_name,
            country: {
              id: flight.arrival_airport_country_id,
              name: flight.arrival_airport_country_name,
              code: flight.arrival_airport_country_code,
              created_at: flight.arrival_airport_country_created_at,
              updated_at: flight.arrival_airport_country_updated_at,
            },
            created_at: flight.arrival_airport_city_created_at,
            updated_at: flight.arrival_airport_city_updated_at,
          },
          created_at: flight.arrival_airport_created_at,
          updated_at: flight.arrival_airport_updated_at,
        },
        class_window_price: flight.class_window_price,
      };
    } catch (error) {
      console.log('Error in FlightRepository: updateArrivalAirport:', error);
      throw error;
    } finally {
      await client.release();
    }
  }

  async updateFlightAirplane(id: string, airplane_id: string): Promise<IFlightWithDetails> {
    const client: PoolClient = await this.pool.connect();
    try {
      let query = `UPDATE flights SET airplane_id = $1 WHERE id = $2`;
      await client.query(query, [airplane_id, id]);
      query = `SELECT f.*, 
              a.name AS airplane_name, a.capacity AS airplane_capacity, a.code AS airplane_code, a.created_at AS airplane_created_at, a.updated_at AS airplane_updated_at, 
              da.id AS departure_airport_id, da.name AS departure_airport_name, da.code AS departure_airport_code, da.city_id AS departure_airport_city_id, da.created_at AS departure_airport_created_at, da.updated_at AS departure_airport_updated_at, 
              aa.id AS arrival_airport_id, aa.name AS arrival_airport_name, aa.code AS arrival_airport_code, aa.city_id AS arrival_airport_city_id, aa.created_at AS arrival_airport_created_at, aa.updated_at AS arrival_airport_updated_at, 
              dac.id AS departure_airport_city_id, dac.name AS departure_airport_city_name, dac.country_id AS departure_airport_country_id, dac.created_at AS departure_airport_city_created_at, dac.updated_at AS departure_airport_city_updated_at, 
              aac.id AS arrival_airport_city_id, aac.name AS arrival_airport_city_name, aac.country_id AS arrival_airport_country_id, aac.created_at AS arrival_airport_city_created_at, aac.updated_at AS arrival_airport_city_updated_at, 
              daco.id AS departure_airport_country_id, daco.name AS departure_airport_country_name, daco.code AS departure_airport_country_code, daco.created_at AS departure_airport_country_created_at, daco.updated_at AS departure_airport_country_updated_at, 
              aaco.id AS arrival_airport_country_id, aaco.name AS arrival_airport_country_name, aaco.code AS arrival_airport_country_code, aaco.created_at AS arrival_airport_country_created_at, aaco.updated_at AS arrival_airport_country_updated_at
                FROM flights f
                  INNER JOIN airplanes a ON f.airplane_id = a.id
                  INNER JOIN airports da ON f.departure_airport_id = da.id
                  INNER JOIN airports aa ON f.arrival_airport_id = aa.id
                  INNER JOIN cities dac ON da.city_id = dac.id
                  INNER JOIN cities aac ON aa.city_id = aac.id
                  INNER JOIN countries daco ON dac.country_id = daco.id
                  INNER JOIN countries aaco ON aac.country_id = aaco.id
                WHERE f.id = $1`;
      const result = await client.query(query, [id]);
      const flight = result.rows[0];
      if (flight === null) {
        throw new Error(`Flight with id ${id} not found`);
      }
      return {
        id: flight.id,
        flight_number: flight.flight_number,
        departure_time: flight.departure_time,
        arrival_time: flight.arrival_time,
        status: flight.status,
        price: flight.price,
        created_at: flight.created_at,
        updated_at: flight.updated_at,
        airplane: {
          id: flight.airplane_id,
          name: flight.airplane_name,
          capacity: flight.airplane_capacity,
          code: flight.airplane_code,
          created_at: flight.airplane_created_at,
          updated_at: flight.airplane_updated_at,
        },
        departure_airport: {
          id: flight.departure_airport_id,
          name: flight.departure_airport_name,
          code: flight.departure_airport_code,
          city: {
            id: flight.departure_airport_city_id,
            name: flight.departure_airport_city_name,
            country: {
              id: flight.departure_airport_country_id,
              name: flight.departure_airport_country_name,
              code: flight.departure_airport_country_code,
              created_at: flight.departure_airport_country_created_at,
              updated_at: flight.departure_airport_country_updated_at,
            },
            created_at: flight.departure_airport_city_created_at,
            updated_at: flight.departure_airport_city_updated_at,
          },
          created_at: flight.departure_airport_created_at,
          updated_at: flight.departure_airport_updated_at,
        },
        arrival_airport: {
          id: flight.arrival_airport_id,
          name: flight.arrival_airport_name,
          code: flight.arrival_airport_code,
          city: {
            id: flight.arrival_airport_city_id,
            name: flight.arrival_airport_city_name,
            country: {
              id: flight.arrival_airport_country_id,
              name: flight.arrival_airport_country_name,
              code: flight.arrival_airport_country_code,
              created_at: flight.arrival_airport_country_created_at,
              updated_at: flight.arrival_airport_country_updated_at,
            },
            created_at: flight.arrival_airport_city_created_at,
            updated_at: flight.arrival_airport_city_updated_at,
          },
          created_at: flight.arrival_airport_created_at,
          updated_at: flight.arrival_airport_updated_at,
        },
        class_window_price: flight.class_window_price,
      };
    } catch (error) {
      console.log('Error in FlightRepository: updateFlightAirplane:', error);
      throw error;
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
      if (!flight) {
        throw new Error(`Flight with id ${flight_id} not found`);
      }
      const flightWindow: IClassWindowPrice = flight.class_window_price;
      if (window_type === 'economy') {
        if (flightWindow[window_type].first_window_seats >= seats)
          flightWindow[window_type].first_window_seats -= seats;
        else if (flightWindow[window_type].second_window_seats >= seats)
          flightWindow[window_type].second_window_seats -= seats;
        else if (flightWindow[window_type].third_window_seats >= seats)
          flightWindow[window_type].third_window_seats -= seats;
        else throw new Error(`Not enough seats available for ${window_type} window type`);
      } else {
        if (flightWindow[window_type].first_window_seats >= seats)
          flightWindow[window_type].first_window_seats -= seats;
        else if (flightWindow[window_type].second_window_seats >= seats)
          flightWindow[window_type].second_window_seats -= seats;
        else throw new Error(`Not enough seats available for ${window_type} window type`);
      }
      query = `UPDATE flights SET class_window_price = $1 WHERE id = $2`;
      await client.query(query, [flightWindow, flight_id]);
    } catch (error) {
      console.log('Error in FlightRepository: updateFlightWindowSeats:', error);
      throw error;
    }
  }

  async deleteFlight(id: string): Promise<void> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = `DELETE FROM flights WHERE id = $1`;
      await client.query(query, [id]);
    } catch (error) {
      console.log('Error in FlightRepository: deleteFlight:', error);
      throw error;
    } finally {
      await client.release();
    }
  }
}

import { Pool, PoolClient } from 'pg';
import {
  IFlightAutomation,
  IFlightAutomationRequest,
  IFlightAutomationResponse,
} from '../interface/flight_automation.interface';
import { ApiError } from '../util/api.util';
import { getPool } from '../util/dbPool.util';
import { FlightRepository } from './flight.repository';
import { AirportRepository } from './airport.repositry';
import { AirplaneRepository } from './airplane.repository';
import { IFlightStatus } from '../types/flight.types';

export class FlightAutomationRepository {
  private pool: Pool = getPool();
  private flightRepository: FlightRepository;
  private airportRepository: AirportRepository;
  private airplaneRepository: AirplaneRepository;

  constructor() {
    this.flightRepository = new FlightRepository();
    this.airportRepository = new AirportRepository();
    this.airplaneRepository = new AirplaneRepository();
  }

  async createFlightAutomation(flightAutomation: IFlightAutomationRequest): Promise<IFlightAutomation> {
    const client: PoolClient = await this.pool.connect();

    try {
      const query = `
      SELECT * FROM flight_automations
      WHERE airplane_id = $1 AND is_cancelled = false;
    `;
      const response = await client.query(query, [flightAutomation.airplane_id]);
      const scheduledRotations: IFlightAutomation[] = response.rows;

      if (scheduledRotations.length > 0) {
        let minimumDepartureTime = new Date(Date.now()); // current UTC
        let maximumArrivalTime = new Date(0); // epoch start

        for (const rotation of scheduledRotations) {
          if (rotation.flight_rotation.length === 0) continue;

          const base = new Date(rotation.start_date);
          let currDate = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate()));
          currDate.setUTCDate(currDate.getUTCDate() + rotation.offset_day);

          rotation.flight_rotation.forEach((flightLeg, idx) => {
            const [depH, depM] = flightLeg.departure_time.split(':').map(Number);
            // eslint-disable-next-line prefer-const
            let [arrH, arrM] = flightLeg.arrival_time.split(':').map(Number);

            if (arrH < depH || (arrH === depH && arrM < depM)) {
              arrH += 24;
            }

            const flightDepartureTime = new Date(currDate.getTime());
            flightDepartureTime.setUTCHours(depH, depM, 0, 0);

            const flightArrivalTime = new Date(flightDepartureTime.getTime());
            flightArrivalTime.setUTCHours(arrH, arrM, 0, 0);

            if (idx === 0 && flightDepartureTime < minimumDepartureTime) {
              minimumDepartureTime = flightDepartureTime;
            }
            if (flightArrivalTime > maximumArrivalTime) {
              maximumArrivalTime = flightArrivalTime;
            }

            currDate = new Date(flightArrivalTime.getTime());
          });
        }

        const flightAutomationMinimumDepartureTime = new Date(flightAutomation.start_date);
        const flightAutomationMaximumArrivalTime = new Date(0);

        const baseDate = new Date(flightAutomation.start_date);
        const [depHour, depMinute] = flightAutomation.flight_rotation[0].departure_time.split(':').map(Number);
        flightAutomationMinimumDepartureTime.setUTCHours(depHour, depMinute, 0, 0);

        let currDate = new Date(baseDate.getTime());

        for (const flightLeg of flightAutomation.flight_rotation) {
          const [depH, depM] = flightLeg.departure_time.split(':').map(Number);
          // eslint-disable-next-line prefer-const
          let [arrH, arrM] = flightLeg.arrival_time.split(':').map(Number);

          if (arrH < depH || (arrH === depH && arrM < depM)) {
            arrH += 24;
          }

          const legDeparture = new Date(currDate.getTime());
          legDeparture.setUTCHours(depH, depM, 0, 0);

          const legArrival = new Date(legDeparture.getTime());
          legArrival.setUTCHours(arrH, arrM, 0, 0);

          if (legArrival > flightAutomationMaximumArrivalTime) {
            flightAutomationMaximumArrivalTime.setTime(legArrival.getTime());
          }

          currDate = new Date(legArrival.getTime());
        }

        if (
          flightAutomationMinimumDepartureTime <= maximumArrivalTime ||
          flightAutomationMaximumArrivalTime <= maximumArrivalTime
        ) {
          throw new ApiError(400, 'Flight automation overlaps with existing flight automations for this airplane');
        }
      }

      const airplane = await this.airplaneRepository.getAirplaneById(flightAutomation.airplane_id);

      await Promise.all(
        flightAutomation.flight_rotation.map(async (flightLeg, idx) => {
          await this.airportRepository.getAirportById(flightLeg.departure_airport_id);
          await this.airportRepository.getAirportById(flightLeg.arrival_airport_id);

          const { business, premium, economy } = flightLeg.class_window_price;
          const businessSeats = business.first_window_seats + business.second_window_seats;
          const premiumSeats = premium.first_window_seats + premium.second_window_seats;
          const economySeats = economy.first_window_seats + economy.second_window_seats + economy.third_window_seats;

          if (businessSeats !== airplane.business_class_seats) {
            throw new ApiError(
              400,
              `Business class seats in flight leg ${idx + 1} (${businessSeats}) do not match airplane capacity (${airplane.business_class_seats})`,
            );
          }
          if (premiumSeats !== airplane.premium_class_seats) {
            throw new ApiError(
              400,
              `Premium class seats in flight leg ${idx + 1} (${premiumSeats}) do not match airplane capacity (${airplane.premium_class_seats})`,
            );
          }
          if (economySeats !== airplane.economy_class_seats) {
            throw new ApiError(
              400,
              `Economy class seats in flight leg ${idx + 1} (${economySeats}) do not match airplane capacity (${airplane.economy_class_seats})`,
            );
          }
        }),
      );

      const insertQuery = `
      INSERT INTO flight_automations (start_date, airplane_id, flight_rotation)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

      const insertValues = [
        new Date(flightAutomation.start_date),
        flightAutomation.airplane_id,
        JSON.stringify(flightAutomation.flight_rotation),
      ];

      const insertResponse = await client.query(insertQuery, insertValues);
      return insertResponse.rows[0];
    } finally {
      client.release();
    }
  }

  async getAllFlightAutomations(offset: number): Promise<IFlightAutomationResponse[]> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = `SELECT * FROM flight_automations ORDER BY  id OFFSET $1 LIMIT 10`;
      const response = await client.query(query, [offset]);
      const flightAutomations: IFlightAutomation[] = response.rows;
      const flightAutomationWithDetails: IFlightAutomationResponse[] = await Promise.all(
        flightAutomations.map(async (flightAutomation) => {
          const airplane = await this.airplaneRepository.getAirplaneById(flightAutomation.airplane_id);
          const flightRotations = await Promise.all(
            flightAutomation.flight_rotation.map(async (flightLeg) => {
              const departureAirport = await this.airportRepository.getAirportById(flightLeg.departure_airport_id);
              const arrivalAirport = await this.airportRepository.getAirportById(flightLeg.arrival_airport_id);
              return {
                price: flightLeg.price,
                arrival_time: flightLeg.arrival_time,
                departure_time: flightLeg.departure_time,
                arrival_airport: arrivalAirport,
                departure_airport: departureAirport,
                class_window_price: flightLeg.class_window_price,
              };
            }),
          );
          return {
            id: flightAutomation.id,
            start_date: flightAutomation.start_date,
            offset_day: flightAutomation.offset_day,
            is_cancelled: flightAutomation.is_cancelled,
            airplane: airplane,
            flight_rotation: flightRotations,
            created_at: flightAutomation.created_at,
            updated_at: flightAutomation.updated_at,
          };
        }),
      );
      return flightAutomationWithDetails;
    } finally {
      client.release();
    }
  }

  async getActiveFlightAutomations(): Promise<IFlightAutomation[]> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = `SELECT * FROM flight_automations WHERE is_cancelled = false`;
      const response = await client.query(query);
      const flightAutomations: IFlightAutomation[] = response.rows;
      return flightAutomations;
    } finally {
      client.release();
    }
  }

  async getFlightAutomationById(id: string): Promise<IFlightAutomation> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = `SELECT * FROM flight_automations WHERE id = $1`;
      const response = await client.query(query, [id]);
      const flightAutomation: IFlightAutomation | undefined = response.rows[0];
      if (!flightAutomation) {
        throw new ApiError(404, `Flight automation with id ${id} not found`);
      }
      return flightAutomation;
    } finally {
      client.release();
    }
  }

  async getFlightAutomationsByDate(date: Date, offset: number): Promise<IFlightAutomationResponse[]> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = `
        SELECT * FROM flight_automations
        WHERE start_date::date = $1
        ORDER BY id OFFSET $2 LIMIT 10;
      `;
      const response = await client.query(query, [date.toISOString().split('T')[0], offset]);
      const flightAutomations: IFlightAutomation[] = response.rows;
      const flightAutomationWithDetails: IFlightAutomationResponse[] = await Promise.all(
        flightAutomations.map(async (flightAutomation) => {
          const airplane = await this.airplaneRepository.getAirplaneById(flightAutomation.airplane_id);
          const flightRotations = await Promise.all(
            flightAutomation.flight_rotation.map(async (flightLeg) => {
              const departureAirport = await this.airportRepository.getAirportById(flightLeg.departure_airport_id);
              const arrivalAirport = await this.airportRepository.getAirportById(flightLeg.arrival_airport_id);
              return {
                price: flightLeg.price,
                arrival_time: flightLeg.arrival_time,
                departure_time: flightLeg.departure_time,
                arrival_airport: arrivalAirport,
                departure_airport: departureAirport,
                class_window_price: flightLeg.class_window_price,
              };
            }),
          );
          return {
            id: flightAutomation.id,
            start_date: flightAutomation.start_date,
            offset_day: flightAutomation.offset_day,
            is_cancelled: flightAutomation.is_cancelled,
            airplane: airplane,
            flight_rotation: flightRotations,
            created_at: flightAutomation.created_at,
            updated_at: flightAutomation.updated_at,
          };
        }),
      );
      return flightAutomationWithDetails;
    } finally {
      client.release();
    }
  }

  async getFlightAutomationsByCancelledStatus(
    isCancelled: boolean,
    offset: number,
  ): Promise<IFlightAutomationResponse[]> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = `
        SELECT * FROM flight_automations
        WHERE is_cancelled = $1
        ORDER BY id OFFSET $2 LIMIT 10;
      `;
      const response = await client.query(query, [isCancelled, offset]);
      const flightAutomations: IFlightAutomation[] = response.rows;
      const flightAutomationWithDetails: IFlightAutomationResponse[] = await Promise.all(
        flightAutomations.map(async (flightAutomation) => {
          const airplane = await this.airplaneRepository.getAirplaneById(flightAutomation.airplane_id);
          const flightRotations = await Promise.all(
            flightAutomation.flight_rotation.map(async (flightLeg) => {
              const departureAirport = await this.airportRepository.getAirportById(flightLeg.departure_airport_id);
              const arrivalAirport = await this.airportRepository.getAirportById(flightLeg.arrival_airport_id);
              return {
                price: flightLeg.price,
                arrival_time: flightLeg.arrival_time,
                departure_time: flightLeg.departure_time,
                arrival_airport: arrivalAirport,
                departure_airport: departureAirport,
                class_window_price: flightLeg.class_window_price,
              };
            }),
          );
          return {
            id: flightAutomation.id,
            start_date: flightAutomation.start_date,
            offset_day: flightAutomation.offset_day,
            is_cancelled: flightAutomation.is_cancelled,
            airplane: airplane,
            flight_rotation: flightRotations,
            created_at: flightAutomation.created_at,
            updated_at: flightAutomation.updated_at,
          };
        }),
      );
      return flightAutomationWithDetails;
    } finally {
      client.release();
    }
  }

  async createFlightsFromAutomation(): Promise<void> {
    const client: PoolClient = await this.pool.connect();
    try {
      const flightAutomations = await this.getActiveFlightAutomations();
      for (const flightAutomation of flightAutomations) {
        const { start_date, flight_rotation, airplane_id, offset_day } = flightAutomation;
        const startDate = new Date(start_date);
        let day = 0;
        // create two months of flights
        while (day++ < 60) {
          const currentDate = new Date(startDate);
          currentDate.setUTCDate(currentDate.getUTCDate() + day + offset_day);
          for (const flightLeg of flight_rotation) {
            const [depH, depM] = flightLeg.departure_time.split(':').map(Number);
            const [arrH, arrM] = flightLeg.arrival_time.split(':').map(Number);
            const flightRequest = {
              airplane_id,
              departure_airport_id: flightLeg.departure_airport_id,
              arrival_airport_id: flightLeg.arrival_airport_id,
              departure_time: new Date(new Date(currentDate.getTime()).setUTCHours(depH, depM, 0, 0)),
              arrival_time: new Date(new Date(currentDate.getTime()).setUTCHours(arrH, arrM, 0, 0)),
              status: 'SCHEDULED' as IFlightStatus,
              class_window_price: flightLeg.class_window_price,
              price: flightLeg.price,
            };
            await this.flightRepository.createFlight(flightRequest);
          }
        }
        const query = `UPDATE flight_automations SET offset_day = $1 WHERE id = $2`;
        const values = [offset_day + day - 1, flightAutomation.id];
        await client.query(query, values);
      }
    } finally {
      client.release();
    }
  }

  async updateFlightAutomationById(id: string): Promise<IFlightAutomationResponse> {
    const client: PoolClient = await this.pool.connect();
    try {
      const flightAutomation = await this.getFlightAutomationById(id);
      const query = `UPDATE flight_automations SET is_cancelled = $1 WHERE id = $2 RETURNING *`;
      const response = await client.query(query, [!flightAutomation.is_cancelled, id]);
      const updatedFlightAutomation: IFlightAutomation = response.rows[0];
      const airplane = await this.airplaneRepository.getAirplaneById(updatedFlightAutomation.airplane_id);
      const flightRotations = await Promise.all(
        updatedFlightAutomation.flight_rotation.map(async (flightLeg) => {
          const departureAirport = await this.airportRepository.getAirportById(flightLeg.departure_airport_id);
          const arrivalAirport = await this.airportRepository.getAirportById(flightLeg.arrival_airport_id);
          return {
            price: flightLeg.price,
            arrival_time: flightLeg.arrival_time,
            departure_time: flightLeg.departure_time,
            arrival_airport: arrivalAirport,
            departure_airport: departureAirport,
            class_window_price: flightLeg.class_window_price,
          };
        }),
      );
      return {
        id: updatedFlightAutomation.id,
        start_date: updatedFlightAutomation.start_date,
        offset_day: updatedFlightAutomation.offset_day,
        is_cancelled: updatedFlightAutomation.is_cancelled,
        airplane: airplane,
        flight_rotation: flightRotations,
        created_at: updatedFlightAutomation.created_at,
        updated_at: updatedFlightAutomation.updated_at,
      };
    } finally {
      client.release();
    }
  }
}

import { Client } from 'pg';

import { IFlight, IFlightRequest } from '../interface/flights.interface';
import { config } from '../util/db.utils';

export class FlightRepository {
  private client: Client;

  constructor() {
    this.client = new Client(config);
  }

  async createFlight(data: IFlightRequest): Promise<IFlight> {
    try {
      const query = `INSERT INTO flights (flight_number, airplane_id, departure_id, arrival_id, departure_time, arrival_time, status, price, booked_seats) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;
      await this.client.connect();
      const result = await this.client.query(query, [
        data.flight_number,
        data.airplane_id,
        data.departure_city_id,
        data.arrival_city_id,
        data.departure_time,
        data.arrival_time,
        data.status,
        data.price,
        data.booked_seats,
      ]);
      await this.client.end();
      const flight: IFlight = result.rows[0];
      return flight;
    } catch (error) {
      console.log('Error in FlightRepository: createFlight:', error);
      throw error;
    }
  }

  async getAllFlights(): Promise<IFlight[]> {
    try {
      const query = `SELECT * FROM flights`;
      await this.client.connect();
      const result = await this.client.query(query);
      await this.client.end();
      const flights: IFlight[] = result.rows;
      return flights;
    } catch (error) {
      console.log('Error in FlightRepository: getAllFlights:', error);
      throw error;
    }
  }

  async getFlightById(id: string): Promise<IFlight> {
    try {
      const query = `SELECT * FROM flights WHERE id = $1`;
      await this.client.connect();
      const result = await this.client.query(query, [id]);
      await this.client.end();
      const flight: IFlight | null = result.rows[0];
      if (flight === null) {
        throw new Error(`Flight with id ${id} not found`);
      }
      return flight;
    } catch (error) {
      console.log('Error in FlightRepository: getFlightById:', error);
      throw error;
    }
  }

  async getFlightByFlightNumber(flight_number: string): Promise<IFlight> {
    try {
      const query = `SELECT * FROM flights WHERE flight_number = $1`;
      await this.client.connect();
      const result = await this.client.query(query, [flight_number]);
      await this.client.end();
      const flight: IFlight | null = result.rows[0];
      if (flight === null) {
        throw new Error(`Flight with number ${flight_number} not found`);
      }
      return flight;
    } catch (error) {
      console.log('Error in FlightRepository: getFlightByNumber:', error);
      throw error;
    }
  }
}

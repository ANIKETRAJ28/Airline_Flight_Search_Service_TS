import { Pool, PoolClient } from 'pg';

import { IFlightRequest, IFlightWithDetails } from '../interface/flights.interface';
import { getPool } from '../util/dbPool.util';
import { IFlightStatus } from '../types/flightStatus.types';

export class FlightRepository {
  private pool: Pool = getPool();

  constructor() {}

  async createFlight(data: IFlightRequest): Promise<IFlightWithDetails> {
    const client: PoolClient = await this.pool.connect();
    try {
      let query = `INSERT INTO flights 
                    (airplane_id, departure_airport_id, arrival_airport_id, departure_time, arrival_time, status, price) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7) 
                  RETURNING id`;
      const flightPayload = await client.query(query, [
        data.airplane_id,
        data.departure_airport_id,
        data.arrival_airport_id,
        data.departure_time,
        data.arrival_time,
        data.status,
        data.price,
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
      return flights.map((flight) => ({
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
      }));
    } catch (error) {
      console.log('Error in FlightRepository: getAllFlights:', error);
      throw error;
    } finally {
      await client.release();
    }
  }

  async getFlightById(id: string): Promise<IFlightWithDetails> {
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
      };
    } catch (error) {
      console.log('Error in FlightRepository: getFlightById:', error);
      throw error;
    } finally {
      await client.release();
    }
  }

  async getFlightWithDetailById(id: string): Promise<IFlightWithDetails> {
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
      };
    } catch (error) {
      console.log('Error in FlightRepository: getFlightWithDetailById:', error);
      throw error;
    } finally {
      await client.release();
    }
  }

  async getFlightsForArrivalAndDepartureCity(
    departure_city_id: string,
    arrival_city_id: string,
    date: Date,
    // date: string,
  ): Promise<IFlightWithDetails[]> {
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
                      WHERE aac.id = $1 AND dac.id = $2 AND f.departure_time::date = $3`;
      const result = await client.query(query, [arrival_city_id, departure_city_id, date]);
      const flights = result.rows;
      if (flights === null) {
        throw new Error(`Flight not found`);
      }
      const flightsWithDetails: IFlightWithDetails[] = flights.map((flight) => ({
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
      }));
      return flightsWithDetails;
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
      };
    } catch (error) {
      console.log('Error in FlightRepository: updateFlightAirplane:', error);
      throw error;
    } finally {
      await client.release();
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

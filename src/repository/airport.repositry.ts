import { Pool, PoolClient } from 'pg';

import { IAirport, IAirportRequest, IAirportWithCityAndCountry } from '../interface/airports.interface';
import { getPool } from '../util/dbPool.util';

export class AirportRepository {
  private pool: Pool = getPool();

  constructor() {}

  async createAirport(data: IAirportRequest): Promise<IAirport> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = 'INSERT INTO airports (name, code, city_id) VALUES ($1, $2, $3) RETURNING *';
      const result = await client.query(query, [data.name, data.code, data.city_id]);
      const airport: IAirport = result.rows[0];
      return airport;
    } catch (error) {
      console.log('Error in AirportRepository: createAirport');
      throw error;
    } finally {
      await client.release();
    }
  }

  async getAirportById(id: string): Promise<IAirport> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = `SELECT * FROM airports WHERE id = $1`;

      const result = await client.query(query, [id]);

      const airport: IAirport | null = result.rows[0];
      if (airport === null) {
        throw new Error(`Airport with id ${id} not found`);
      }
      return airport;
    } catch (error) {
      console.log('Error in AirportRepository: getAirportById');
      throw error;
    } finally {
      await client.release();
    }
  }

  async getAirportByCode(code: string): Promise<IAirport> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = `SELECT * FROM airports WHERE code = $1`;

      const result = await client.query(query, [code]);

      const airport: IAirport | null = result.rows[0];
      if (airport === null) {
        throw new Error(`Airport with code ${code} not found`);
      }
      return airport;
    } catch (error) {
      console.log('Error in AirportRepository: getAirportByCode');
      throw error;
    } finally {
      await client.release();
    }
  }

  async getAllAirportsOfCityByCityId(cityId: string): Promise<IAirportWithCityAndCountry[]> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = `SELECT a.*, c.name AS city_name, co.name AS country_name FROM airports a
                     INNER JOIN cities c ON a.city_id = c.id
                     INNER JOIN countries co ON a.country_id = co.id
                     WHERE c.id = $1`;

      const result = await client.query(query, [cityId]);

      const airports: IAirportWithCityAndCountry[] = result.rows;
      return airports;
    } catch (error) {
      console.log('Error in AirportRepository: getAllAirportsForCity');
      throw error;
    } finally {
      await client.release();
    }
  }

  async getAllAirportsOfCityByCityName(city: string): Promise<IAirportWithCityAndCountry[]> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = `SELECT a.*, c.id AS city_id, c.name AS city_name, c.created_at AS city_created_at, c.updated_at AS city_updated_at, c.country_id AS city_country_id, co.id AS country_id, co.name AS country_name, co.code AS country_code, co.created_at AS country_created_at, co.updated_at AS country_updated_at
                     FROM airports a
                     INNER JOIN cities c ON a.city_id = c.id
                     INNER JOIN countries co ON c.country_id = co.id
                     WHERE c.name = $1`;

      const result = await client.query(query, [city]);

      const airports = result.rows;
      return airports.map((airport) => ({
        id: airport.id,
        name: airport.name,
        code: airport.code,
        city: {
          id: airport.city_id,
          name: airport.city_name,
          country_id: airport.city_country_id,
          created_at: airport.city_created_at,
          updated_at: airport.city_updated_at,
        },
        country: {
          id: airport.country_id,
          name: airport.country_name,
          code: airport.country_code,
          created_at: airport.country_created_at,
          updated_at: airport.country_updated_at,
        },
        created_at: airport.created_at,
        updated_at: airport.updated_at,
      }));
    } catch (error) {
      console.log('Error in AirportRepository: getAirportsForCity');
      throw error;
    } finally {
      await client.release();
    }
  }

  async getAllAirports(): Promise<IAirport[]> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = `SELECT * FROM airports`;

      const result = await client.query(query);

      const airports: IAirport[] = result.rows;
      return airports;
    } catch (error) {
      console.log('Error in AirportRepository: getAllAirports');
      throw error;
    } finally {
      await client.release();
    }
  }

  async updateAirportName(id: string, name: string): Promise<IAirport> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = `UPDATE airports SET name = $1 WHERE id = $2 RETURNING *`;

      const result = await client.query(query, [name, id]);

      const airport: IAirport | null = result.rows[0];
      if (airport === null) {
        throw new Error(`Airport with id ${id} not found`);
      }
      return airport;
    } catch (error) {
      console.log('Error in AirportRepository: updateAirportName');
      throw error;
    } finally {
      await client.release();
    }
  }

  async updateAirportCode(id: string, code: string): Promise<IAirport> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = `UPDATE airports SET code = $1 WHERE id = $2 RETURNING *`;

      const result = await client.query(query, [code, id]);

      const airport: IAirport | null = result.rows[0];
      if (airport === null) {
        throw new Error(`Airport with id ${id} not found`);
      }
      return airport;
    } catch (error) {
      console.log('Error in AirportRepository: updateAirportCode');
      throw error;
    } finally {
      await client.release();
    }
  }

  async deleteAirport(id: string): Promise<void> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = `DELETE FROM airports WHERE id = $1`;

      await client.query(query, [id]);
    } catch (error) {
      console.log('Error in AirportRepository: deleteAirport');
      throw error;
    } finally {
      await client.release();
    }
  }
}

import { Pool, PoolClient } from 'pg';

import { IAirportRequest, IAirportWithCityAndCountry } from '../interface/airports.interface';
import { getPool } from '../util/dbPool.util';
import { fetchAirportById, returnAirport } from '../util/airportQuery.util';
import { ApiError } from '../util/api.util';

export class AirportRepository {
  private pool: Pool = getPool();

  constructor() {}

  async createAirport(data: IAirportRequest): Promise<IAirportWithCityAndCountry> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = 'INSERT INTO airports (name, code, city_id) VALUES ($1, $2, $3) RETURNING id';
      const airportPayload = await client.query(query, [data.name, data.code, data.city_id]);
      const airport_id = airportPayload.rows[0].id;
      const result = await client.query(fetchAirportById, [airport_id]);
      const airport = result.rows[0];
      return returnAirport(airport);
    } finally {
      await client.release();
    }
  }

  async getAirportById(id: string): Promise<IAirportWithCityAndCountry> {
    const client: PoolClient = await this.pool.connect();
    try {
      const result = await client.query(fetchAirportById, [id]);
      const airport = result.rows[0];
      if (airport === undefined) {
        throw new ApiError(404, `Airport with id ${id} not found`);
      }
      return returnAirport(airport);
    } finally {
      await client.release();
    }
  }

  async getAirportByCode(code: string): Promise<IAirportWithCityAndCountry> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = `SELECT a.*, 
                    c.id AS city_id, c.name AS city_name, c.created_at AS city_created_at, c.updated_at AS city_updated_at, 
                    co.id AS country_id, co.name AS country_name, co.code AS country_code, co.created_at AS country_created_at, co.updated_at AS country_updated_at 
                      FROM airports a
                        INNER JOIN cities c ON a.city_id = c.id
                        INNER JOIN countries co ON c.country_id = co.id
                      WHERE a.code = $1`;
      const result = await client.query(query, [code]);
      const airport = result.rows[0];
      if (airport === undefined) {
        throw new ApiError(404, `Airport with code ${code} not found`);
      }
      return returnAirport(airport);
    } finally {
      await client.release();
    }
  }

  async getAllAirportsOfCityByCityId(cityId: string): Promise<IAirportWithCityAndCountry[]> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = `SELECT a.*, 
                    c.id AS city_id, c.name AS city_name, c.created_at AS city_created_at, c.updated_at AS city_updated_at, 
                    co.id AS country_id, co.name AS country_name, co.code AS country_code, co.created_at AS country_created_at, co.updated_at AS country_updated_at 
                      FROM airports a
                        INNER JOIN cities c ON a.city_id = c.id
                        INNER JOIN countries co ON c.country_id = co.id
                      WHERE c.id = $1`;
      const result = await client.query(query, [cityId]);
      const airports = result.rows;
      return airports.map((airport) => returnAirport(airport));
    } finally {
      await client.release();
    }
  }

  async getAllAirportsOfCityByCityName(city: string): Promise<IAirportWithCityAndCountry[]> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = `SELECT a.*, 
                    c.id AS city_id, c.name AS city_name, c.created_at AS city_created_at, c.updated_at AS city_updated_at, 
                    co.id AS country_id, co.name AS country_name, co.code AS country_code, co.created_at AS country_created_at, co.updated_at AS country_updated_at 
                      FROM airports a
                        INNER JOIN cities c ON a.city_id = c.id
                        INNER JOIN countries co ON c.country_id = co.id
                      WHERE c.name = $1`;
      const result = await client.query(query, [city]);
      const airports = result.rows;
      return airports.map((airport) => returnAirport(airport));
    } finally {
      await client.release();
    }
  }

  async getAllAirports(): Promise<IAirportWithCityAndCountry[]> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = `SELECT a.*, 
                    c.id AS city_id, c.name AS city_name, c.created_at AS city_created_at, c.updated_at AS city_updated_at, 
                    co.id AS country_id, co.name AS country_name, co.code AS country_code, co.created_at AS country_created_at, co.updated_at AS country_updated_at 
                      FROM airports a
                        INNER JOIN cities c ON a.city_id = c.id
                        INNER JOIN countries co ON c.country_id = co.id`;
      const result = await client.query(query);
      const airports = result.rows;
      return airports.map((airport) => returnAirport(airport));
    } finally {
      await client.release();
    }
  }

  async updateAirportName(id: string, name: string): Promise<IAirportWithCityAndCountry> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = `UPDATE airports SET name = $1 WHERE id = $2`;
      await client.query(query, [name, id]);
      const result = await client.query(fetchAirportById, [id]);
      const airport = result.rows[0];
      if (airport === undefined) {
        throw new ApiError(404, `Airport with id ${id} not found`);
      }
      return returnAirport(airport);
    } finally {
      await client.release();
    }
  }

  async updateAirportCode(id: string, code: string): Promise<IAirportWithCityAndCountry> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = `UPDATE airports SET code = $1 WHERE id = $2`;
      await client.query(query, [code, id]);
      const result = await client.query(fetchAirportById, [id]);
      const airport = result.rows[0];
      if (airport === undefined) {
        throw new ApiError(404, `Airport with id ${id} not found`);
      }
      return returnAirport(airport);
    } finally {
      await client.release();
    }
  }

  async deleteAirport(id: string): Promise<void> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = `DELETE FROM airports WHERE id = $1`;
      await client.query(query, [id]);
    } finally {
      await client.release();
    }
  }
}

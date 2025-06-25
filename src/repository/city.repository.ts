import { PoolClient } from 'pg';

import { ICityRequest, ICityWithCountry } from '../interface/cities.interface';
import { getPool } from '../util/dbPool.util';
import { ApiError } from '../util/api.util';

export class CityRepository {
  private pool = getPool();

  constructor() {}

  async getAllCities(): Promise<ICityWithCountry[]> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = `SELECT c.*, co.name AS country_name, co.code AS country_code, co.created_at AS country_created_at, co.updated_at AS country_updated_at FROM cities c INNER JOIN countries co ON c.country_id = co.id`;
      const result = await client.query(query);
      const cities: ICityWithCountry[] = result.rows.map((row) => ({
        id: row.id,
        name: row.name,
        country: {
          id: row.country_id,
          name: row.country_name,
          code: row.country_code,
          created_at: row.country_created_at,
          updated_at: row.country_updated_at,
        },
        created_at: row.created_at,
        updated_at: row.updated_at,
      }));
      return cities;
    } finally {
      await client.release();
    }
  }

  async getCityById(id: string): Promise<ICityWithCountry> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = `SELECT c.*, co.name AS country_name, co.code AS country_code, co.created_at AS country_created_at, co.updated_at AS country_updated_at FROM cities c INNER JOIN countries co ON c.country_id = co.id WHERE c.id = $1`;
      const result = await client.query(query, [id]);
      const city = result.rows[0];
      if (city === undefined) {
        throw new ApiError(404, `City with id ${id} not found`);
      }
      const cityResponse: ICityWithCountry = {
        id: city.id,
        name: city.name,
        country: {
          id: city.country_id,
          code: city.country_code,
          name: city.country_name,
          created_at: city.country_created_at,
          updated_at: city.country_updated_at,
        },
        created_at: city.created_at,
        updated_at: city.updated_at,
      };
      return cityResponse;
    } finally {
      await client.release();
    }
  }

  async getCityByName(name: string): Promise<ICityWithCountry> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = `SELECT c.*, co.name AS country_name, co.code AS country_code, co.created_at AS country_created_at, co.updated_at AS country_updated_at FROM cities c INNER JOIN countries co ON c.country_id = co.id WHERE c.name = $1`;
      const result = await client.query(query, [name]);
      const city = result.rows[0];
      if (city === undefined) {
        throw new ApiError(404, `City with name ${name} not found`);
      }
      const cityResponse: ICityWithCountry = {
        id: city.id,
        name: city.name,
        country: {
          id: city.country_id,
          code: city.country_code,
          name: city.country_name,
          created_at: city.country_created_at,
          updated_at: city.country_updated_at,
        },
        created_at: city.created_at,
        updated_at: city.updated_at,
      };
      return cityResponse;
    } finally {
      await client.release();
    }
  }

  async createCity(city: ICityRequest): Promise<ICityWithCountry> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = `INSERT INTO cities (name, country_id) VALUES ($1, $2)`;
      await client.query(query, [city.name, city.country_id]);
      return this.getCityByName(city.name);
    } finally {
      await client.release();
    }
  }

  async updateCityName(id: string, name: string): Promise<ICityWithCountry> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = 'UPDATE cities SET name = $1 WHERE id = $2';
      await client.query(query, [name, id]);
      return this.getCityById(id);
    } finally {
      await client.release();
    }
  }

  async deleteCity(id: string): Promise<void> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = 'DELETE FROM cities WHERE id = $1';
      await client.query(query, [id]);
    } finally {
      await client.release();
    }
  }

  async getCityByAirportId(airportId: string): Promise<ICityWithCountry> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = `SELECT c.*, co.name AS country_name, co.code AS country_code, co.created_at AS country_created_at, co.updated_at AS country_updated_at 
                     FROM cities c 
                     INNER JOIN countries co ON c.country_id = co.id 
                     INNER JOIN airports a ON c.id = a.city_id 
                     WHERE a.id = $1`;
      const result = await client.query(query, [airportId]);
      const city = result.rows[0];
      if (city === undefined) {
        throw new ApiError(404, `City for airport with id ${airportId} not found`);
      }
      const cityResponse: ICityWithCountry = {
        id: city.id,
        name: city.name,
        country: {
          id: city.country_id,
          code: city.country_code,
          name: city.country_name,
          created_at: city.country_created_at,
          updated_at: city.country_updated_at,
        },
        created_at: city.created_at,
        updated_at: city.updated_at,
      };
      return cityResponse;
    } finally {
      await client.release();
    }
  }
}

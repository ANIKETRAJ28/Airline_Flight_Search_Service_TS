import { PoolClient } from 'pg';
import { ICountry, ICountryRequest } from '../interface/countries.interface';
import { getPool } from '../util/dbPool.util';
import { ApiError } from '../util/api.util';

export class CountryRepository {
  private pool = getPool();

  constructor() {}

  async getAllCountries(): Promise<ICountry[]> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = 'SELECT * FROM countries';
      const result = await client.query(query);
      const countries: ICountry[] = result.rows;
      return countries;
    } finally {
      await client.release();
    }
  }

  async getCountryById(id: string): Promise<ICountry> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = 'SELECT * FROM countries WHERE id = $1';
      const result = await client.query(query, [id]);
      const country: ICountry | undefined = result.rows[0];
      if (country === undefined) {
        throw new ApiError(404, `Country with id ${id} not found`);
      }
      return country;
    } finally {
      await client.release();
    }
  }

  async getCountryByName(name: string): Promise<ICountry> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = 'SELECT * FROM countries WHERE name = $1';
      const result = await client.query(query, [name]);
      const country: ICountry | undefined = result.rows[0];
      if (country === undefined) {
        throw new ApiError(404, `Country with name ${name} not found`);
      }
      return country;
    } finally {
      await client.release();
    }
  }

  async getCountryByCode(code: string): Promise<ICountry> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = 'SELECT * FROM countries WHERE code = $1';
      const result = await client.query(query, [code]);
      const country: ICountry | undefined = result.rows[0];
      if (country === undefined) {
        throw new ApiError(404, `Country with code ${code} not found`);
      }
      return country;
    } finally {
      await client.release();
    }
  }

  async createCountry(country: ICountryRequest): Promise<ICountry> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = 'INSERT INTO countries (name, code) VALUES ($1, $2) RETURNING *';
      const result = await client.query(query, [country.name, country.code]);
      const newCountry: ICountry = result.rows[0];
      return newCountry;
    } finally {
      await client.release();
    }
  }

  async updateCountryName(id: string, name: string): Promise<ICountry> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = 'UPDATE countries SET name = $1 WHERE id = $2 RETURNING *';
      const result = await client.query(query, [name, id]);
      const updatedCountry: ICountry | undefined = result.rows[0];
      if (updatedCountry === undefined) {
        throw new ApiError(404, `Country with id ${id} not found`);
      }
      return updatedCountry;
    } finally {
      await client.release();
    }
  }

  async updateCountryCode(id: string, code: string): Promise<ICountry> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = 'UPDATE countries SET code = $1 WHERE id = $2 RETURNING *';
      const result = await client.query(query, [code, id]);
      const updatedCountry: ICountry | undefined = result.rows[0];
      if (updatedCountry === undefined) {
        throw new ApiError(404, `Country with id ${id} not found`);
      }
      return updatedCountry;
    } finally {
      await client.release();
    }
  }

  async deleteCountry(id: string): Promise<void> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = 'DELETE FROM countries WHERE id = $1';
      await client.query(query, [id]);
    } finally {
      await client.release();
    }
  }
}

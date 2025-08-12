import { PoolClient } from 'pg';
import { ICountry, ICountryRequest } from '../interface/countries.interface';
import { getPool } from '../util/dbPool.util';
import { ApiError } from '../util/api.util';

export class CountryRepository {
  private pool = getPool();

  constructor() {}

  async getCountries(): Promise<ICountry[]> {
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

  async getAllCountries(offset: number): Promise<ICountry[]> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = 'SELECT * FROM countries ORDER BY id DESC LIMIT 10 OFFSET $1';
      const result = await client.query(query, [offset]);
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

  async searchCountry(keyword: string, offset: number): Promise<ICountry[]> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = 'SELECT * FROM countries WHERE name ILIKE $1 OR code ILIKE $1 ORDER BY id DESC LIMIT 10 OFFSET $2';
      const result = await client.query(query, [`%${keyword}%`, offset]);
      const countries: ICountry[] = result.rows;
      return countries;
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
      let query = 'SELECT * FROM countries WHERE name = $1 OR code = $2';
      let result = await client.query(query, [country.name, country.code]);
      if (result.rows.length > 0) {
        throw new ApiError(400, `Country with name ${country.name} or code ${country.code} already exists`);
      }
      query = 'INSERT INTO countries (name, code) VALUES ($1, $2) RETURNING *';
      result = await client.query(query, [country.name, country.code]);
      const newCountry: ICountry = result.rows[0];
      return newCountry;
    } finally {
      await client.release();
    }
  }

  async updateCountry(id: string, data: ICountry): Promise<ICountry> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = 'UPDATE countries SET name = $1, code = $2 WHERE id = $3 RETURNING *';
      const result = await client.query(query, [data.name, data.code, id]);
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

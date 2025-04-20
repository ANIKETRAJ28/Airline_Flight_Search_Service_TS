import { Client } from 'pg';

import { ICountry, ICountryRequest } from '../interface/countries.interface';
import { config } from '../util/db.utils';

export class CountryRepository {
  private client: Client;

  constructor() {
    this.client = new Client(config);
  }

  async getAllCountries(): Promise<ICountry[]> {
    try {
      const query = 'SELECT * FROM countries';
      await this.client.connect();
      const result = await this.client.query(query);
      await this.client.end();
      const countries: ICountry[] = result.rows;
      return countries;
    } catch (error) {
      console.log('Error in CountryRepo: getAllCountries:', error);
      throw error;
    }
  }

  async getCountryById(id: string): Promise<ICountry> {
    try {
      const query = 'SELECT * FROM countries WHERE id = $1';
      await this.client.connect();
      const result = await this.client.query(query, [id]);
      await this.client.end();
      const country: ICountry | null = result.rows[0];
      if (country === null) {
        throw new Error(`Country with id ${id} not found`);
      }
      return country;
    } catch (error) {
      console.log('Error in CountryRepo: getCountryById:', error);
      throw error;
    }
  }

  async createCountry(country: ICountryRequest): Promise<ICountry> {
    try {
      const query = 'INSERT INTO countries (name, code) VALUES ($1, $2) RETURNING *';
      await this.client.connect();
      const result = await this.client.query(query, [country.name, country.code]);
      await this.client.end();
      const newCountry: ICountry = result.rows[0];
      return newCountry;
    } catch (error) {
      console.log('Error in CountryRepo: createCountry:', error);
      throw error;
    }
  }
}

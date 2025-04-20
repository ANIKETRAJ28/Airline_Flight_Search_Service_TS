import { Client } from 'pg';

import { ICity, ICityRequest, ICityWithCountry } from '../interface/cities.interface';
import { config } from '../util/db.utils';

export class CityRepository {
  private client: Client;

  constructor() {
    this.client = new Client(config);
  }

  async getAllCities(): Promise<ICity[]> {
    try {
      const query = 'SELECT * FROM cities';
      await this.client.connect();
      const result = await this.client.query(query);
      await this.client.end();
      const cities: ICity[] = result.rows;
      return cities;
    } catch (error) {
      console.log('Error in CityRepo: getAllCities:', error);
      throw error;
    }
  }

  async getAllCitiesWithCountry(): Promise<ICityWithCountry[]> {
    try {
      const query = 'SELECT * FROM cities c INNER JOIN countries co ON c.country_id = co.id';
      await this.client.connect();
      const result = await this.client.query(query);
      await this.client.end();
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
    } catch (error) {
      console.log('Error in CityRepo: getAllCitiesWithCountry:', error);
      throw error;
    }
  }

  async getCityById(id: string): Promise<ICity> {
    try {
      const query = 'SELECT * FROM cities WHERE id = $1';
      await this.client.connect();
      const result = await this.client.query(query, [id]);
      await this.client.end();
      const city: ICity | null = result.rows[0];
      if (city === null) {
        throw new Error(`City with id ${id} not found`);
      }
      return city;
    } catch (error) {
      console.log('Error in CityRepo: getCityById:', error);
      throw error;
    }
  }

  async getCityWithCountryById(id: string): Promise<ICityWithCountry> {
    try {
      const query = 'SELECT * FROM cities c INNER JOIN countries co ON c.country_id = co.id WHERE c.id = $1';
      await this.client.connect();
      const result = await this.client.query(query, [id]);
      await this.client.end();
      const city: ICityWithCountry | null = result.rows[0];
      if (city === null) {
        throw new Error(`City with id ${id} not found`);
      }
      return city;
    } catch (error) {
      console.log('Error in CityRepo: getCityWithCountryById:', error);
      throw error;
    }
  }

  async createCity(city: ICityRequest): Promise<ICity> {
    try {
      const query = `INSERT INTO cities (name, country_id) VALUES ($1, $2) RETURNING *`;
      await this.client.connect();
      const result = await this.client.query(query, [city.name, city.country_id]);
      await this.client.end();
      const newCity: ICity = result.rows[0];
      return newCity;
    } catch (error) {
      console.log('Error in CityRepo: createCity:', error);
      throw error;
    }
  }
}

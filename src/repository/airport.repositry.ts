import { Client } from 'pg';

import { IAirport, IAirportRequest, IAirportWithCityAndCountry } from '../interface/airports.interface';
import { config } from '../util/db.utils';

export class AirportRepository {
  private client: Client;

  constructor() {
    this.client = new Client(config);
  }

  async createAirport(data: IAirportRequest): Promise<IAirport> {
    try {
      const query = 'INSERT INTO airports (name, code, city_id, country_id) VALUES ($1, $2, $3, $4)';
      await this.client.connect();
      const result = await this.client.query(query, [data.name, data.code, data.city_id, data.country_id]);
      await this.client.end();
      const airport: IAirport = result.rows[0];
      return airport;
    } catch (error) {
      console.log('Error in AirportRepository: createAirport');
      throw error;
    }
  }

  async getAirportById(id: string): Promise<IAirport> {
    try {
      const query = `SELECT * FROM airports WHERE id = $1`;
      await this.client.connect();
      const result = await this.client.query(query, [id]);
      await this.client.end();
      const airport: IAirport | null = result.rows[0];
      if (airport === null) {
        throw new Error(`Airport with id ${id} not found`);
      }
      return airport;
    } catch (error) {
      console.log('Error in AirportRepository: getAirportById');
      throw error;
    }
  }

  async getAirportByCode(code: string): Promise<IAirport> {
    try {
      const query = `SELECT * FROM airports WHERE code = $1`;
      await this.client.connect();
      const result = await this.client.query(query, [code]);
      await this.client.end();
      const airport: IAirport | null = result.rows[0];
      if (airport === null) {
        throw new Error(`Airport with code ${code} not found`);
      }
      return airport;
    } catch (error) {
      console.log('Error in AirportRepository: getAirportByCode');
      throw error;
    }
  }

  async getAllAirportsForCityByCityId(cityId: string): Promise<IAirport[]> {
    try {
      const query = `SELECT * FROM airports WHERE city_id = $1`;
      await this.client.connect();
      const result = await this.client.query(query, [cityId]);
      await this.client.end();
      const airports: IAirport[] = result.rows;
      return airports;
    } catch (error) {
      console.log('Error in AirportRepository: getAllAirportsForCity');
      throw error;
    }
  }

  async getAirportsForCity(city: string): Promise<IAirportWithCityAndCountry[]> {
    try {
      const query = `SELECT a.*, c.name AS city_name, co.name AS country_name FROM airports a
                     INNER JOIN cities c ON a.city_id = c.id
                     INNER JOIN countries co ON a.country_id = co.id
                     WHERE c.name = $1`;
      await this.client.connect();
      const result = await this.client.query(query, [city]);
      await this.client.end();
      const airports: IAirportWithCityAndCountry[] = result.rows;
      return airports;
    } catch (error) {
      console.log('Error in AirportRepository: getAirportsForCity');
      throw error;
    }
  }

  async getAllAirports(): Promise<IAirport[]> {
    try {
      const query = `SELECT * FROM airports`;
      await this.client.connect();
      const result = await this.client.query(query);
      await this.client.end();
      const airports: IAirport[] = result.rows;
      return airports;
    } catch (error) {
      console.log('Error in AirportRepository: getAllAirports');
      throw error;
    }
  }

  async updateAirportName(id: string, name: string): Promise<IAirport> {
    try {
      const query = `UPDATE airports SET name = $1 WHERE id = $2 RETURNING *`;
      await this.client.connect();
      const result = await this.client.query(query, [name, id]);
      await this.client.end();
      const airport: IAirport | null = result.rows[0];
      if (airport === null) {
        throw new Error(`Airport with id ${id} not found`);
      }
      return airport;
    } catch (error) {
      console.log('Error in AirportRepository: updateAirportName');
      throw error;
    }
  }

  async updateAirportCode(id: string, code: string): Promise<IAirport> {
    try {
      const query = `UPDATE airports SET code = $1 WHERE id = $2 RETURNING *`;
      await this.client.connect();
      const result = await this.client.query(query, [code, id]);
      await this.client.end();
      const airport: IAirport | null = result.rows[0];
      if (airport === null) {
        throw new Error(`Airport with id ${id} not found`);
      }
      return airport;
    } catch (error) {
      console.log('Error in AirportRepository: updateAirportCode');
      throw error;
    }
  }
}

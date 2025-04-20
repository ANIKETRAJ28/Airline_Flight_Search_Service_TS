import { Client } from 'pg';

import { IAirplane, IAirplaneRequest } from '../interface/airplanes.interface';
import { config } from '../util/db.utils';

export class AirplaneRepository {
  private client: Client;

  constructor() {
    this.client = new Client(config);
  }

  async getAllAirplanes(): Promise<IAirplane[]> {
    try {
      const query = 'SELECT * FROM airplanes';
      await this.client.connect();
      const result = await this.client.query(query);
      await this.client.end();
      const airplanes: IAirplane[] = result.rows;
      return airplanes;
    } catch (error) {
      console.log('Error in AirplaneRepository: getAllAirplanes:', error);
      throw error;
    }
  }

  async getAirplaneById(id: string): Promise<IAirplane> {
    try {
      const query = 'SELECT * FROM airplanes WHERE id = $1';
      await this.client.connect();
      const result = await this.client.query(query, [id]);
      await this.client.end();
      const airplane: IAirplane | null = result.rows[0];
      if (airplane === null) {
        throw new Error(`Airplane with id ${id} not found`);
      }
      return airplane;
    } catch (error) {
      console.log('Error in AirplaneRepository: getAirplaneById:', error);
      throw error;
    }
  }

  async getAirplaneByCode(code: string): Promise<IAirplane> {
    try {
      const query = 'SELECT * FROM airplanes WHERE code = $1';
      await this.client.connect();
      const result = await this.client.query(query, [code]);
      await this.client.end();
      const airplane: IAirplane | null = result.rows[0];
      if (airplane === null) {
        throw new Error(`Airplane with code ${code} not found`);
      }
      return airplane;
    } catch (error) {
      console.log('Error in AirplaneRepository: getAirplaneByCode:', error);
      throw error;
    }
  }

  async getAirplaneByName(name: string): Promise<IAirplane> {
    try {
      const query = 'SELECT * FROM airplanes WHERE name = $1';
      await this.client.connect();
      const result = await this.client.query(query, [name]);
      await this.client.end();
      const airplane: IAirplane | null = result.rows[0];
      if (airplane === null) {
        throw new Error(`Airplane with name ${name} not found`);
      }
      return airplane;
    } catch (error) {
      console.log('Error in AirplaneRepository: getAirplaneByName:', error);
      throw error;
    }
  }

  async createAirplane(airplane: IAirplaneRequest): Promise<IAirplane> {
    try {
      const query = 'INSERT INTO airplanes (name, code, capacity) VALUES ($1, $2, $3) RETURNING *';
      await this.client.connect();
      const result = await this.client.query(query, [airplane.name, airplane.code, airplane.capacity]);
      await this.client.end();
      const newAirplane: IAirplane = result.rows[0];
      return newAirplane;
    } catch (error) {
      console.log('Error in AirplaneRepository: createAirplane:', error);
      throw error;
    }
  }

  async updateAirplane(id: string, airplane: IAirplaneRequest): Promise<IAirplane> {
    try {
      const query = 'UPDATE airplanes SET name = $1, code = $2, capacity = $3 WHERE id = $4 RETURNING *';
      await this.client.connect();
      const result = await this.client.query(query, [airplane.name, airplane.code, airplane.capacity, id]);
      await this.client.end();
      const updatedAirplane: IAirplane | null = result.rows[0];
      if (updatedAirplane === null) {
        throw new Error(`Airplane with id ${id} not found`);
      }
      return updatedAirplane;
    } catch (error) {
      console.log('Error in AirplaneRepository: updateAirplane:', error);
      throw error;
    }
  }

  async deleteAirplane(id: string): Promise<void> {
    try {
      const query = 'DELETE FROM airplanes WHERE id = $1';
      await this.client.connect();
      await this.client.query(query, [id]);
      await this.client.end();
    } catch (error) {
      console.log('Error in AirplaneRepository: deleteAirplane:', error);
      throw error;
    }
  }
}

import { PoolClient } from 'pg';
import { IAirplane, IAirplaneRequest } from '../interface/airplanes.interface';
import { getPool } from '../util/dbPool.util';
import { ApiError } from '../util/api.util';

export class AirplaneRepository {
  private pool = getPool();

  constructor() {}

  async getAllAirplanes(): Promise<IAirplane[]> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = 'SELECT * FROM airplanes';
      const result = await client.query(query);
      const airplanes: IAirplane[] = result.rows;
      return airplanes;
    } finally {
      await client.release();
    }
  }

  async getAirplaneById(id: string): Promise<IAirplane> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = 'SELECT * FROM airplanes WHERE id = $1';
      const result = await client.query(query, [id]);
      const airplane: IAirplane | undefined = result.rows[0];
      if (airplane === undefined) {
        throw new ApiError(404, `Airplane with id ${id} not found`);
      }
      return airplane;
    } finally {
      await client.release();
    }
  }

  async getAirplaneByCode(code: string): Promise<IAirplane> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = 'SELECT * FROM airplanes WHERE code = $1';
      const result = await client.query(query, [code]);
      const airplane: IAirplane | undefined = result.rows[0];
      if (airplane === undefined) {
        throw new ApiError(404, `Airplane with code ${code} not found`);
      }
      return airplane;
    } finally {
      await client.release();
    }
  }

  async getAirplaneByName(name: string): Promise<IAirplane> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = 'SELECT * FROM airplanes WHERE name = $1';
      const result = await client.query(query, [name]);
      const airplane: IAirplane | undefined = result.rows[0];
      if (airplane === undefined) {
        throw new ApiError(404, `Airplane with name ${name} not found`);
      }
      return airplane;
    } finally {
      await client.release();
    }
  }

  async createAirplane(airplane: IAirplaneRequest): Promise<IAirplane> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = 'INSERT INTO airplanes (name, code, capacity) VALUES ($1, $2, $3) RETURNING *';
      const result = await client.query(query, [airplane.name, airplane.code, airplane.capacity]);
      const newAirplane: IAirplane = result.rows[0];
      return newAirplane;
    } finally {
      await client.release();
    }
  }

  async updateAirplaneName(id: string, name: string): Promise<IAirplane> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = 'UPDATE airplanes SET name = $1 WHERE id = $2 RETURNING *';
      const result = await client.query(query, [name, id]);
      const updatedAirplane: IAirplane | undefined = result.rows[0];
      if (updatedAirplane === undefined) {
        throw new ApiError(404, `Airplane with id ${id} not found`);
      }
      return updatedAirplane;
    } finally {
      await client.release();
    }
  }

  async updateAirplaneCode(id: string, code: string): Promise<IAirplane> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = 'UPDATE airplanes SET code = $1 WHERE id = $2 RETURNING *';
      const result = await client.query(query, [code, id]);
      const updatedAirplane: IAirplane | undefined = result.rows[0];
      if (updatedAirplane === undefined) {
        throw new ApiError(404, `Airplane with id ${id} not found`);
      }
      return updatedAirplane;
    } finally {
      await client.release();
    }
  }

  async updateAirplaneCapacity(id: string, capacity: number): Promise<IAirplane> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = 'UPDATE airplanes SET capacity = $1 WHERE id = $2 RETURNING *';
      const result = await client.query(query, [capacity, id]);
      const updatedAirplane: IAirplane | undefined = result.rows[0];
      if (updatedAirplane === undefined) {
        throw new ApiError(404, `Airplane with id ${id} not found`);
      }
      return updatedAirplane;
    } finally {
      await client.release();
    }
  }

  async deleteAirplane(id: string): Promise<void> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = 'DELETE FROM airplanes WHERE id = $1';
      await client.query(query, [id]);
    } finally {
      await client.release();
    }
  }
}

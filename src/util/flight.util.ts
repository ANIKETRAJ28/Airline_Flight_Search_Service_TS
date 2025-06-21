import { Pool, PoolClient } from 'pg';
import { getPool } from './dbPool.util';
import { IFlightWithDetails } from '../interface/flights.interface';

export async function queryFlightWithDetailById(id: string): Promise<IFlightWithDetails> {
  const pool: Pool = getPool();
  const client: PoolClient = await pool.connect();
  try {
    const query = `SELECT f.*, 
                    a.name AS airplane_name, a.capacity AS airplane_capacity, a.code AS airplane_code, a.created_at AS airplane_created_at, a.updated_at AS airplane_updated_at, 
                    da.id AS departure_airport_id, da.name AS departure_airport_name, da.code AS departure_airport_code, da.city_id AS departure_airport_city_id, da.created_at AS departure_airport_created_at, da.updated_at AS departure_airport_updated_at, 
                    aa.id AS arrival_airport_id, aa.name AS arrival_airport_name, aa.code AS arrival_airport_code, aa.city_id AS arrival_airport_city_id, aa.created_at AS arrival_airport_created_at, aa.updated_at AS arrival_airport_updated_at, 
                    dac.id AS departure_airport_city_id, dac.name AS departure_airport_city_name, dac.country_id AS departure_airport_country_id, dac.created_at AS departure_airport_city_created_at, dac.updated_at AS departure_airport_city_updated_at, 
                    aac.id AS arrival_airport_city_id, aac.name AS arrival_airport_city_name, aac.country_id AS arrival_airport_country_id, aac.created_at AS arrival_airport_city_created_at, aac.updated_at AS arrival_airport_city_updated_at, 
                    daco.id AS departure_airport_country_id, daco.name AS departure_airport_country_name, daco.code AS departure_airport_country_code, daco.created_at AS departure_airport_country_created_at, daco.updated_at AS departure_airport_country_updated_at, 
                    aaco.id AS arrival_airport_country_id, aaco.name AS arrival_airport_country_name, aaco.code AS arrival_airport_country_code, aaco.created_at AS arrival_airport_country_created_at, aaco.updated_at AS arrival_airport_country_updated_at
                    FROM flights f
                      INNER JOIN airplanes a ON f.airplane_id = a.id
                      INNER JOIN airports da ON f.departure_airport_id = da.id
                      INNER JOIN airports aa ON f.arrival_airport_id = aa.id
                      INNER JOIN cities dac ON da.city_id = dac.id
                      INNER JOIN cities aac ON aa.city_id = aac.id
                      INNER JOIN countries daco ON dac.country_id = daco.id
                      INNER JOIN countries aaco ON aac.country_id = aaco.id
                    WHERE f.id = $1`;
    const result = await client.query(query, [id]);
    const flight = result.rows[0];
    if (flight === null) {
      throw new Error(`Flight with id ${id} not found`);
    }
    return {
      id: flight.id,
      flight_number: flight.flight_number,
      departure_time: flight.departure_time,
      arrival_time: flight.arrival_time,
      status: flight.status,
      price: flight.price,
      created_at: flight.created_at,
      updated_at: flight.updated_at,
      airplane: {
        id: flight.airplane_id,
        name: flight.airplane_name,
        capacity: flight.airplane_capacity,
        code: flight.airplane_code,
        created_at: flight.airplane_created_at,
        updated_at: flight.airplane_updated_at,
      },
      departure_airport: {
        id: flight.departure_airport_id,
        name: flight.departure_airport_name,
        code: flight.departure_airport_code,
        city: {
          id: flight.departure_airport_city_id,
          name: flight.departure_airport_city_name,
          country: {
            id: flight.departure_airport_country_id,
            name: flight.departure_airport_country_name,
            code: flight.departure_airport_country_code,
            created_at: flight.departure_airport_country_created_at,
            updated_at: flight.departure_airport_country_updated_at,
          },
          created_at: flight.departure_airport_city_created_at,
          updated_at: flight.departure_airport_city_updated_at,
        },
        created_at: flight.departure_airport_created_at,
        updated_at: flight.departure_airport_updated_at,
      },
      arrival_airport: {
        id: flight.arrival_airport_id,
        name: flight.arrival_airport_name,
        code: flight.arrival_airport_code,
        city: {
          id: flight.arrival_airport_city_id,
          name: flight.arrival_airport_city_name,
          country: {
            id: flight.arrival_airport_country_id,
            name: flight.arrival_airport_country_name,
            code: flight.arrival_airport_country_code,
            created_at: flight.arrival_airport_country_created_at,
            updated_at: flight.arrival_airport_country_updated_at,
          },
          created_at: flight.arrival_airport_city_created_at,
          updated_at: flight.arrival_airport_city_updated_at,
        },
        created_at: flight.arrival_airport_created_at,
        updated_at: flight.arrival_airport_updated_at,
      },
      class_window_price: flight.class_window_price,
    };
  } catch (error) {
    console.log('Issue in flightQuery util');
    throw error;
  } finally {
    client.release();
  }
}

export const queryFlightsWithDetails = `SELECT f.*, 
  a.name AS airplane_name, a.capacity AS airplane_capacity, a.code AS airplane_code, a.created_at AS airplane_created_at, a.updated_at AS airplane_updated_at, 
  da.id AS departure_airport_id, da.name AS departure_airport_name, da.code AS departure_airport_code, da.city_id AS departure_airport_city_id, da.created_at AS departure_airport_created_at, da.updated_at AS departure_airport_updated_at, 
  aa.id AS arrival_airport_id, aa.name AS arrival_airport_name, aa.code AS arrival_airport_code, aa.city_id AS arrival_airport_city_id, aa.created_at AS arrival_airport_created_at, aa.updated_at AS arrival_airport_updated_at, 
  dac.id AS departure_airport_city_id, dac.name AS departure_airport_city_name, dac.country_id AS departure_airport_country_id, dac.created_at AS departure_airport_city_created_at, dac.updated_at AS departure_airport_city_updated_at, 
  aac.id AS arrival_airport_city_id, aac.name AS arrival_airport_city_name, aac.country_id AS arrival_airport_country_id, aac.created_at AS arrival_airport_city_created_at, aac.updated_at AS arrival_airport_city_updated_at, 
  daco.id AS departure_airport_country_id, daco.name AS departure_airport_country_name, daco.code AS departure_airport_country_code, daco.created_at AS departure_airport_country_created_at, daco.updated_at AS departure_airport_country_updated_at, 
  aaco.id AS arrival_airport_country_id, aaco.name AS arrival_airport_country_name, aaco.code AS arrival_airport_country_code, aaco.created_at AS arrival_airport_country_created_at, aaco.updated_at AS arrival_airport_country_updated_at
  FROM flights f
    INNER JOIN airplanes a ON f.airplane_id = a.id
    INNER JOIN airports da ON f.departure_airport_id = da.id
    INNER JOIN airports aa ON f.arrival_airport_id = aa.id
    INNER JOIN cities dac ON da.city_id = dac.id
    INNER JOIN cities aac ON aa.city_id = aac.id
    INNER JOIN countries daco ON dac.country_id = daco.id
    INNER JOIN countries aaco ON aac.country_id = aaco.id`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function returnFlightQuery(flight: any): IFlightWithDetails {
  return {
    id: flight.id,
    flight_number: flight.flight_number,
    departure_time: flight.departure_time,
    arrival_time: flight.arrival_time,
    status: flight.status,
    price: flight.price,
    created_at: flight.created_at,
    updated_at: flight.updated_at,
    airplane: {
      id: flight.airplane_id,
      name: flight.airplane_name,
      capacity: flight.airplane_capacity,
      code: flight.airplane_code,
      created_at: flight.airplane_created_at,
      updated_at: flight.airplane_updated_at,
    },
    departure_airport: {
      id: flight.departure_airport_id,
      name: flight.departure_airport_name,
      code: flight.departure_airport_code,
      city: {
        id: flight.departure_airport_city_id,
        name: flight.departure_airport_city_name,
        country: {
          id: flight.departure_airport_country_id,
          name: flight.departure_airport_country_name,
          code: flight.departure_airport_country_code,
          created_at: flight.departure_airport_country_created_at,
          updated_at: flight.departure_airport_country_updated_at,
        },
        created_at: flight.departure_airport_city_created_at,
        updated_at: flight.departure_airport_city_updated_at,
      },
      created_at: flight.departure_airport_created_at,
      updated_at: flight.departure_airport_updated_at,
    },
    arrival_airport: {
      id: flight.arrival_airport_id,
      name: flight.arrival_airport_name,
      code: flight.arrival_airport_code,
      city: {
        id: flight.arrival_airport_city_id,
        name: flight.arrival_airport_city_name,
        country: {
          id: flight.arrival_airport_country_id,
          name: flight.arrival_airport_country_name,
          code: flight.arrival_airport_country_code,
          created_at: flight.arrival_airport_country_created_at,
          updated_at: flight.arrival_airport_country_updated_at,
        },
        created_at: flight.arrival_airport_city_created_at,
        updated_at: flight.arrival_airport_city_updated_at,
      },
      created_at: flight.arrival_airport_created_at,
      updated_at: flight.arrival_airport_updated_at,
    },
    class_window_price: flight.class_window_price,
  };
}

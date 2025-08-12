import fs from 'fs';
import { getPool } from '../util/dbPool.util';

interface Input {
  name: string;
  code: string;
  cities: {
    name: string;
    airports: {
      name: string;
      code: string;
    }[];
  }[];
}

interface IAirplane {
  name: string;
  code: string;
  economy_class_seats: number;
  premium_class_seats: number;
  business_class_seats: number;
}

export async function seedData(): Promise<void> {
  const pool = getPool();
  const client = await pool.connect();

  try {
    const records = JSON.parse(fs.readFileSync('countries_cities_airports.json', 'utf-8')) as Input[];
    await client.query('BEGIN');

    for (const rec of records) {
      let query = `INSERT INTO countries (name, code) VALUES ($1, $2) RETURNING id;`;
      const countryResult = await client.query(query, [rec.name, rec.code]);
      const countryId = countryResult.rows[0].id;
      for (const city of rec.cities) {
        query = `INSERT INTO cities (name, country_id) VALUES ($1, $2) RETURNING id;`;
        const cityResult = await client.query(query, [city.name, countryId]);
        const cityId = cityResult.rows[0].id;

        for (const airport of city.airports) {
          query = `INSERT INTO airports (name, code, city_id) VALUES ($1, $2, $3);`;
          await client.query(query, [airport.name, airport.code, cityId]);
        }
      }
    }
    await client.query('COMMIT');

    await client.query('BEGIN');
    const airplaneRecord = JSON.parse(fs.readFileSync('airplanes.json', 'utf-8')) as IAirplane[];
    for (const airplane of airplaneRecord) {
      const query = `
        INSERT INTO airplanes (name, code, economy_class_seats, premium_class_seats, business_class_seats)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
      `;
      await client.query(query, [
        airplane.name,
        airplane.code,
        airplane.economy_class_seats,
        airplane.premium_class_seats,
        airplane.business_class_seats,
      ]);
    }
    await client.query('COMMIT');
    console.log('🎉 Seed completed successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seed failed:', err);
    throw err;
  } finally {
    client.release();
  }
}

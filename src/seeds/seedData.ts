import fs from 'fs';
import { getPool } from '../util/dbPool.util';

type CountryInput = {
  country_code: string;
  country: string;
};

type CityInput = {
  country_code: string;
  city: string;
};

type AirportInput = {
  airport: string;
  iata: string;
  city: string;
};

type AirplaneInput = {
  name: string;
  code: string;
  capacity: number;
};

export async function seedData(): Promise<void> {
  const pool = getPool();
  const client = await pool.connect();

  try {
    const countryRecords = JSON.parse(fs.readFileSync('countries.json', 'utf-8')) as CountryInput[];
    await client.query('BEGIN');

    for (const rec of countryRecords) {
      const countryExists = await client.query(`SELECT id FROM countries WHERE name = $1 OR code = $2;`, [
        rec.country,
        rec.country_code,
      ]);
      if (countryExists.rows.length === 0) {
        await client.query(`INSERT INTO countries (name, code) VALUES ($1, $2);`, [rec.country, rec.country_code]);
      }
    }

    await client.query('COMMIT');

    const cityRecords = JSON.parse(fs.readFileSync('cities.json', 'utf-8')) as CityInput[];
    await client.query('BEGIN');

    for (const rec of cityRecords) {
      const cityExists = await client.query(`SELECT id FROM cities WHERE name = $1;`, [rec.city]);
      if (cityExists.rows.length === 0) {
        const countryExists = await client.query(`SELECT id FROM countries WHERE code = $1;`, [rec.country_code]);
        if (countryExists.rows.length !== 0) {
          await client.query(`INSERT INTO cities (name, country_id) values ($1, $2)`, [
            rec.city,
            countryExists.rows[0].id,
          ]);
        }
      }
    }

    await client.query('COMMIT');

    const airportRecords = JSON.parse(fs.readFileSync('airports.json', 'utf-8')) as AirportInput[];
    await client.query('BEGIN');

    for (const rec of airportRecords) {
      const cityExists = await client.query(`SELECT id FROM cities WHERE name = $1;`, [rec.city]);
      if (cityExists.rows.length !== 0) {
        const airportExists = await client.query(`SELECT id FROM airports WHERE name = $1 OR code = $2;`, [
          rec.airport,
          rec.iata,
        ]);
        if (airportExists.rows.length === 0) {
          await client.query(`INSERT INTO airports (name, code, city_id) values ($1, $2, $3)`, [
            rec.airport,
            rec.iata,
            cityExists.rows[0].id,
          ]);
        }
      }
    }

    await client.query('COMMIT');

    const airplaneRecords = JSON.parse(fs.readFileSync('airplanes.json', 'utf-8')) as AirplaneInput[];
    await client.query('BEGIN');

    for (const rec of airplaneRecords) {
      const airplaneExists = await client.query(`SELECT id FROM airplanes WHERE name = $1 OR code = $2;`, [
        rec.name,
        rec.code,
      ]);
      if (airplaneExists.rows.length === 0) {
        await client.query(`INSERT INTO airplanes (name, code, capacity) VALUES ($1, $2, $3)`, [
          rec.name,
          rec.code,
          rec.capacity,
        ]);
      }
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

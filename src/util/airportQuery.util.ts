import { IAirportWithCityAndCountry } from '../interface/airports.interface';

export const fetchAirportById = `
SELECT 
  a.*, 
  c.id AS city_id, c.name AS city_name, c.created_at AS city_created_at, c.updated_at AS city_updated_at, 
  co.id AS country_id, co.name AS country_name, co.code AS country_code, co.created_at AS country_created_at, co.updated_at AS country_updated_at 
    FROM airports a
      INNER JOIN cities c ON a.city_id = c.id
      INNER JOIN countries co ON c.country_id = co.id
    WHERE a.id = $1
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const returnAirport = (airport: any): IAirportWithCityAndCountry => {
  return {
    id: airport.id,
    name: airport.name,
    code: airport.code,
    created_at: airport.created_at,
    updated_at: airport.updated_at,
    city: {
      id: airport.city_id,
      name: airport.city_name,
      created_at: airport.city_created_at,
      updated_at: airport.city_updated_at,
      country: {
        id: airport.country_id,
        name: airport.country_name,
        code: airport.country_code,
        created_at: airport.country_created_at,
        updated_at: airport.country_updated_at,
      },
    },
  };
};

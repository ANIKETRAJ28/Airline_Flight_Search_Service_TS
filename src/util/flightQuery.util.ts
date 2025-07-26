import {
  IClassWindowPrice,
  IClassWindowPriceForUser,
  IFlight,
  IFlightWithDetails,
  IFlightWithDetailsForUser,
} from '../interface/flights.interface';

export const fetchFlightBy = (by: string, offset?: number): string =>
  offset !== undefined
    ? `
SELECT 
  f.*, 
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
  WHERE f.${by} = $1 OFFSET $2 LIMIT 10`
    : `
SELECT 
  f.*, 
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
  WHERE f.${by} = $1`;

export const fetchFlights = `
SELECT 
  f.*, 
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
  ORDER BY f.departure_time DESC
  OFFSET $1
  LIMIT 10
`;

export const classPriceSeat = (
  flight: IFlight | IFlightWithDetails,
  class_window_price: IClassWindowPrice,
): IClassWindowPriceForUser => {
  return {
    business: {
      total_seats: flight.class_window_price.business.total_seats,
      seats: class_window_price.business.first_window_seats + class_window_price.business.second_window_seats,
      price:
        class_window_price.business.first_window_seats > 0
          ? class_window_price.business.first_window_percentage * flight.price
          : class_window_price.business.second_window_seats > 0
            ? class_window_price.business.second_window_percentage * flight.price
            : 0,
    },
    premium: {
      total_seats: flight.class_window_price.premium.total_seats,
      seats: class_window_price.premium.first_window_seats + class_window_price.premium.second_window_seats,
      price:
        class_window_price.premium.first_window_seats > 0
          ? class_window_price.premium.first_window_percentage * flight.price
          : class_window_price.premium.second_window_seats > 0
            ? class_window_price.premium.second_window_percentage * flight.price
            : 0,
    },
    economy: {
      total_seats: flight.class_window_price.economy.total_seats,
      seats:
        class_window_price.economy.first_window_seats +
        class_window_price.economy.second_window_seats +
        class_window_price.economy.third_window_seats,
      price:
        class_window_price.economy.first_window_seats > 0
          ? class_window_price.economy.first_window_percentage * flight.price
          : class_window_price.economy.second_window_seats > 0
            ? class_window_price.economy.second_window_percentage * flight.price
            : class_window_price.economy.third_window_seats > 0
              ? class_window_price.economy.third_window_percentage * flight.price
              : 0,
    },
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const returnFlight = (flight: any, price: IClassWindowPrice): IFlightWithDetails => {
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
    class_window_price: price,
  };
};

export const returnFlightForUser = (
  flight: IFlightWithDetails,
  class_price_seats: IClassWindowPriceForUser,
): IFlightWithDetailsForUser => {
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
      id: flight.airplane.id,
      name: flight.airplane.name,
      capacity: flight.airplane.capacity,
      code: flight.airplane.code,
      created_at: flight.airplane.created_at,
      updated_at: flight.airplane.updated_at,
    },
    departure_airport: {
      id: flight.departure_airport.id,
      name: flight.departure_airport.name,
      code: flight.departure_airport.code,
      city: {
        id: flight.departure_airport.city.id,
        name: flight.departure_airport.city.name,
        country: {
          id: flight.departure_airport.city.country.id,
          name: flight.departure_airport.city.country.name,
          code: flight.departure_airport.city.country.code,
          created_at: flight.departure_airport.city.country.created_at,
          updated_at: flight.departure_airport.city.country.updated_at,
        },
        created_at: flight.departure_airport.city.created_at,
        updated_at: flight.departure_airport.city.updated_at,
      },
      created_at: flight.departure_airport.created_at,
      updated_at: flight.departure_airport.updated_at,
    },
    arrival_airport: {
      id: flight.arrival_airport.id,
      name: flight.arrival_airport.name,
      code: flight.arrival_airport.code,
      city: {
        id: flight.arrival_airport.city.id,
        name: flight.arrival_airport.city.name,
        country: {
          id: flight.arrival_airport.city.country.id,
          name: flight.arrival_airport.city.country.name,
          code: flight.arrival_airport.city.country.code,
          created_at: flight.arrival_airport.city.country.created_at,
          updated_at: flight.arrival_airport.city.country.updated_at,
        },
        created_at: flight.arrival_airport.city.created_at,
        updated_at: flight.arrival_airport.city.updated_at,
      },
      created_at: flight.arrival_airport.created_at,
      updated_at: flight.arrival_airport.updated_at,
    },
    class_price_seats,
  };
};

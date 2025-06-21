import { IFlightStatus } from '../types/flight.types';
import { IAirplane } from './airplanes.interface';
import { IAirportWithCityAndCountry } from './airports.interface';

export interface IClassWindowPrice {
  economy: {
    first_window_seats: number;
    first_window_percentage: number;
    second_window_seats: number;
    second_window_percentage: number;
    third_window_seats: number;
    third_window_percentage: number;
  };
  premium: {
    first_window_seats: number;
    first_window_percentage: number;
    second_window_seats: number;
    second_window_percentage: number;
  };
  business: {
    first_window_seats: number;
    first_window_percentage: number;
    second_window_seats: number;
    second_window_percentage: number;
  };
}

export interface IClassWindowPriceForUser {
  economy: {
    price: number;
    seats: number;
  };
  premium: {
    price: number;
    seats: number;
  };
  business: {
    price: number;
    seats: number;
  };
}

export interface IFlightRequest {
  airplane_id: string;
  departure_airport_id: string;
  arrival_airport_id: string;
  departure_time: Date;
  arrival_time: Date;
  status: IFlightStatus;
  class_window_price: IClassWindowPrice;
  price: number;
}

export interface IFlight extends IFlightRequest {
  id: string;
  flight_number: string;
  created_at: Date;
  updated_at: Date;
}

export interface IFlightWithDetails
  extends Omit<IFlight, 'airplane_id' | 'departure_airport_id' | 'arrival_airport_id'> {
  airplane: IAirplane;
  departure_airport: IAirportWithCityAndCountry;
  arrival_airport: IAirportWithCityAndCountry;
}

export interface IFlightWithDetailsForUser
  extends Omit<IFlight, 'airplane_id' | 'departure_airport_id' | 'arrival_airport_id' | 'class_window_price'> {
  airplane: IAirplane;
  departure_airport: IAirportWithCityAndCountry;
  arrival_airport: IAirportWithCityAndCountry;
  class_price_seats: IClassWindowPriceForUser;
}

export interface IFlightQueue extends IFlight {
  hops: number;
  min_layover_time: number;
  max_layover_time: number;
}

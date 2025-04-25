import { IFlightStatus } from '../types/flightStatus.types';
import { IAirplane } from './airplanes.interface';
import { IAirportWithCityAndCountry } from './airports.interface';

export interface IFlightRequest {
  airplane_id: string;
  departure_airport_id: string;
  arrival_airport_id: string;
  departure_time: Date;
  arrival_time: Date;
  status: IFlightStatus;
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

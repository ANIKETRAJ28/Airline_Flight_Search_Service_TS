import { IFlightStatus } from '../types/flightStatus.types';

export interface IFlight {
  id: string;
  flight_number: string;
  airplane_id: string;
  departure_city_id: string;
  arrival_city_id: string;
  departure_time: Date;
  arrival_time: Date;
  status: IFlightStatus;
  price: number;
  booked_seats: number;
  created_at: Date;
  updated_at: Date;
}

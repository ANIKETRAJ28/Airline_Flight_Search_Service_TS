import { IClassWindowPrice } from './flights.interface';

export interface IFlightLeg {
  price: number;
  departure_airport_id: string;
  arrival_airport_id: string;
  departure_time: string;
  arrival_time: string;
  class_window_price: IClassWindowPrice;
}

export interface IFlightAutomationRequest {
  start_date: Date;
  airplane_id: string;
  flight_rotation: IFlightLeg[];
}

export interface IFlightAutomationRequestWithoutTotalSeats extends Omit<IFlightAutomationRequest, 'flight_rotation'> {
  flight_rotation: Array<
    Omit<IFlightLeg, 'class_window_price'> & {
      class_window_price: Omit<IClassWindowPrice, 'economy' | 'premium' | 'business'> & {
        economy: Omit<IClassWindowPrice['economy'], 'total_seats'>;
        premium: Omit<IClassWindowPrice['premium'], 'total_seats'>;
        business: Omit<IClassWindowPrice['business'], 'total_seats'>;
      };
    }
  >;
}

export interface IFlightAutomation extends IFlightAutomationRequest {
  id: string;
  offset_day: number;
  is_cancelled: boolean;
  created_at: Date;
  updated_at: Date;
}

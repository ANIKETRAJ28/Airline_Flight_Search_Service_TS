import { ICityWithCountry } from './cities.interface';
export interface IAirportRequest {
  name: string;
  code: string;
  city_id: string;
}

export interface IAirport extends IAirportRequest {
  id: string;
  created_at: Date;
  updated_at: Date;
}
export interface IAirportWithCityAndCountry extends Omit<IAirportRequest, 'city_id'> {
  id: string;
  name: string;
  code: string;
  city: ICityWithCountry;
  created_at: Date;
  updated_at: Date;
}

import { ICountry } from './countries.interface';

export interface ICityRequest {
  name: string;
  country_id: string;
}

export interface ICity extends ICityRequest {
  id: string;
  created_at: Date;
  updated_at: Date;
}
export interface ICityWithCountry {
  id: string;
  name: string;
  country: ICountry;
  created_at: Date;
  updated_at: Date;
}

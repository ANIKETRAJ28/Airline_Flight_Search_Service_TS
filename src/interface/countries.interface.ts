export interface ICountry {
  id: string;
  name: string;
  code: string;
  created_at: Date;
  updated_at: Date;
}

export interface ICountryRequest {
  name: string;
  code: string;
}

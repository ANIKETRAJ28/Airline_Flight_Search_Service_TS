export interface ICountryRequest {
  name: string;
  code: string;
}

export interface ICountry extends ICountryRequest {
  id: string;
  created_at: Date;
  updated_at: Date;
}

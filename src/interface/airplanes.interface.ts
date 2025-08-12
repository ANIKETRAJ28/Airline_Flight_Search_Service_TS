export interface IAirplaneRequest {
  name: string;
  code: string;
  economy_class_seats: number;
  premium_class_seats: number;
  business_class_seats: number;
}

export interface IAirplane extends IAirplaneRequest {
  id: string;
  created_at: Date;
  updated_at: Date;
}

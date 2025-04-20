export interface IAirplaneRequest {
  name: string;
  code: string;
  capacity: number;
}

export interface IAirplane extends IAirplaneRequest {
  id: string;
  created_at: Date;
  updated_at: Date;
}

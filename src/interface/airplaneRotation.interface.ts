export interface IAirplaneRotation {
  id: string;
  airplane_id: string;
  sequence: number;
  from_airport_id: string;
  to_airport_id: string;
  duration_minutes: number;
  offset_minutes: number;
  created_at: Date;
  updated_at: Date;
}

export interface IJWT {
  id: string;
  email: string;
  user_role: 'user' | 'admin' | 'superadmin';
  iat: number;
  exp: number;
}

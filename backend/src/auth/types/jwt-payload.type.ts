export interface JwtPayload {
  sub: number | string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

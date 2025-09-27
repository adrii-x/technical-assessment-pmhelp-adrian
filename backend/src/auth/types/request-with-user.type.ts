// src/auth/types/request-with-user.type.ts
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    id: number;
    email: string;
    role: string; // or an enum if you have UserRole
  };
}

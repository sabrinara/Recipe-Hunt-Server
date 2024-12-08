import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export type JwtPayload = {
  _id: Types.ObjectId; 
  name: string;
  email: string;
  phone?: string;
  imageUrl?: string; 
  role: 'user' | 'admin'; 
  address?: string; 
};

export const createToken = (
  jwtPayload: JwtPayload, 
  secret: string,
  expiresIn: string,
): string => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

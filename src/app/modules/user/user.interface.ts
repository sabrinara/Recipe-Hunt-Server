// user/interface.ts
import { Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone?: string;
  imageUrl?: string;
  role: 'user' | 'admin';
  address?: string;
  premiumMembership?: boolean;
  isBlocked?: boolean;
  follow?:string[];
  followers?:string[];
  isCorrectPassword: (password: string) => Promise<boolean>; 
}

export interface IUserProfileUpdate {
  name?: string;
  email?: string;
  password?: string;
  imageUrl?: string;
  phone?: string;
  address?: string;
}

export interface IAdminUpdate {
  role?: 'user' | 'admin';
  isBlocked?: boolean;
}


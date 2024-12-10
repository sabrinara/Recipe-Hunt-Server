// user/validation.ts
import { z } from 'zod';

export const userSignupSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    imageUrl: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
  }),
});

export const userLoginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

export const userProfileUpdateSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    imageUrl: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
  }),
});

export const adminUpdateSchema = z.object({
  body: z.object({
    role: z.enum(['admin']).optional(),
    isBlocked: z.boolean().optional(),
  }),
});

export const userFollowSchema = z.object({
  body: z.object({
      userId: z.string().min(24, "Invalid user ID format"), // Add validation rules
  }),
});


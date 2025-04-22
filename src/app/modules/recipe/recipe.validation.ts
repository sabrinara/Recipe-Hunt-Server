import mongoose from 'mongoose';
import { z } from 'zod';

// Ingredient Schema
const ingredientSchema = z.object({
  name: z.string().min(1, 'Ingredient name is required.'),
  quantity: z.string().min(1, 'Quantity is required.'),
  type: z.string().min(1).optional(), 
  isChecked: z.boolean().default(false), 
  
});

// Comment Schema
const commentSchema = z.object({
  user: z.string().min(1, 'User ID is required.'),
  comment: z.string().min(1, 'Comment cannot be empty.'),
  date: z.date().default(new Date()), 
});


export const rateRecipeSchema = z.object({
  body: z.object({
    rating: z.number().min(1).max(5, "Rating must be between 1 to 5"),
  }),
});

export const recipeCreateSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Name must be at least 3 characters.'),
    title: z.string().min(3, 'Title must be at least 6 characters.'),
    description: z
      .string()
      .min(10, 'Description must be at least 10 characters.'),
    ingredients: z
      .array(ingredientSchema)
      .min(1, 'At least one ingredient is required.'),
    image: z.array(z.string().url('Image must be a valid URL.')),
    cookingTime: z.number().min(1, 'Cooking time must be at least 1 minute.'),
    tags: z.array(z.string()).min(1, 'At least one tag is required.'),
    user: z
    .string({
      required_error: 'User is required',
    })
    .refine((val) => {
      return mongoose.Types.ObjectId.isValid(val);
    }),
    ratings: z.array(rateRecipeSchema).optional(),
    comments: z.array(commentSchema).optional(),
    difficulty: z.string().optional(),
    upVotes: z.array(z.string()).optional(),
    downVotes: z.array(z.string()).optional(),
    isPublished: z.boolean().default(true),
    isPremium: z.boolean().default(false),
  }),
});

export const updateRecipeValidation = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  ingredients: z.array(
    z.object({
      name: z.string(),
      quantity: z.string(),
    })
  ).optional(),
  cookingTime: z.number().optional(),
  comments: z.array(
    z.object({
      user: z.string(),
      text: z.string(),
    })
  ).optional(),
});

import { z } from 'zod';

// Ingredient Schema
const ingredientSchema = z.object({
  name: z.string().min(1, 'Ingredient name is required.'),
  quantity: z.string().min(1, 'Quantity is required.'),
  type: z.string().min(1).optional(), // Example: "Vegetable", "Spice"
  isChecked: z.boolean().default(false), // Optional with default
  
});

// Comment Schema
const commentSchema = z.object({
  user: z.string().min(1, 'User ID is required.'),
  comment: z.string().min(1, 'Comment cannot be empty.'),
  date: z.date().default(new Date()), // Optional, defaults to current date
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
    image: z.string().url('Image must be a valid URL.'),
    cookingTime: z.number().min(1, 'Cooking time must be at least 1 minute.'),
    tags: z.array(z.string()).min(1, 'At least one tag is required.'),
    writer: z.string().min(1, 'Writer ID is required.'),
    ratings: z.array(z.number()).optional(),
    comments: z.array(commentSchema).optional(),
    difficulty: z.string().optional(),
    upVotes: z.array(z.string()).optional(),
    downVotes: z.array(z.string()).optional(),
    isPublished: z.boolean().default(true),
    isPremium: z.boolean().default(false),
  }),
});

export const recipeUpdateSchema = recipeCreateSchema.partial();

export const rateRecipeSchema = z.object({
  rating: z.number().min(1).max(5),
});
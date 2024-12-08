import { z } from 'zod';

export const recipeCreateSchema = z.object({
  name: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.string(),
  ingredients: z.array(z.string()),
  cookingTime: z.number(),
  tags: z.array(z.string()), // Add validation for tags
});

export const recipeUpdateSchema = recipeCreateSchema.partial();

export const rateRecipeSchema = z.object({
  rating: z.number().min(1).max(5),
});

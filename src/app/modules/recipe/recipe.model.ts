// recipe.model.ts

import { Schema, model, Types, Document } from 'mongoose';
import { IRecipe } from './recipe.interface';

const recipeSchema = new Schema<IRecipe>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User who created the recipe
    name: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: '' },
    ingredients: { type: [String], required: true },
    cookingTime: { type: Number, required: true }, 
    tags: { type: [String], default: [] }, 
    ratings: { type: [Number], default: [] }, 
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment', default: [] }], 
    upvotes: { type: Number, default: 0 }, 
    downvotes: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false }, 
  },
  {
    timestamps: true,
  }
);

// Add any custom methods or statics on the schema here if needed
recipeSchema.methods.calculateAverageRating = function () {
  const ratings = this.ratings;
  return ratings.length ? ratings.reduce((sum : number, rating : number) => sum + rating, 0) / ratings.length : 0;
};

// Export the model
const RecipeModel = model<IRecipe>('Recipe', recipeSchema);
export default RecipeModel;

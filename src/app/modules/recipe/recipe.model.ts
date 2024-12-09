import { Schema, model } from 'mongoose';
import { IRecipe, TIngredients, TComments } from './recipe.interface';

const ingredientSchema = new Schema<TIngredients>({
  name: { type: String, required: true },
  quantity: { type: String, required: true },
  type: { type: String },
  isChecked: { type: Boolean, default: false },
});

const commentSchema = new Schema<TComments>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const recipeSchema = new Schema<IRecipe>(
  {
    writer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: '' },
    ingredients: { type: [ingredientSchema], required: true },
    cookingTime: { type: Number, required: true },
    tags: { type: [String], default: [] },
    ratings: { type: [Number], default: [] },
    comments: { type: [commentSchema], default: [] },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
    isPremium: { type: Boolean, default: false },
  },
  { timestamps: true }
);

recipeSchema.methods.calculateAverageRating = function () {
  return this.ratings.length ? this.ratings.reduce((sum: number, r: number) => sum + r, 0) / this.ratings.length : 0;
};

const RecipeModel = model<IRecipe>('Recipe', recipeSchema);
export default RecipeModel;

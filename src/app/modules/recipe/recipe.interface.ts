import { Types } from 'mongoose';

export interface IRecipe {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  name: string;
  title: string;
  description: string;
  image: string;
  ingredients: string[];
  cookingTime: number; 
  tags: string[]; 
  ratings: number[];
  comments: Types.ObjectId[];
  upvotes: number;
  downvotes: number;
  isPublished: boolean;
}

export interface IRecipeCreate {
  name: string;
  title: string;
  description: string;
  image: string;
  ingredients: string[];
  cookingTime: number;
  tags: string[];
}

export interface IRecipeUpdate {
  name?: string;
  title?: string;
  description?: string;
  image?: string;
  ingredients?: string[];
  cookingTime?: number;
  tags?: string[];
}

export interface IRecipeFilter {
  name?: string;
  title?: string;
  ingredients?: string[]; 
  minCookingTime?: number;
  maxCookingTime?: number;
  tags?: string[];
  keyword?: string; 
}

import { ObjectId, Types } from 'mongoose';

export interface IRecipe {
  user: ObjectId;
  name: string;
  title: string;
  description: string;
  image: string[];
  ingredients: IIngredients[];
  cookingTime: number;
  tags: string[];
  ratings: number[];
  comments: IComments[];
  difficulty: 'easy' | 'medium' | 'hard';
  upvotes: number;
  downvotes: number;
  isPublished: boolean;
  isPremium: boolean;
  averageRating: number;
}

export type IIngredients = {
  name: string;
  quantity: string;
  type?: string;
  isChecked?: boolean;
};

export type IComments = {
  user: Types.ObjectId;
  comment: string;
  date: Date;
};

export interface IRecipeFilter {
  name?: string;
  title?: string;
  ingredients?: string[];
  minCookingTime?: number;
  maxCookingTime?: number;
  tags?: string[];
  keyword?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  isPublished?: boolean;
}

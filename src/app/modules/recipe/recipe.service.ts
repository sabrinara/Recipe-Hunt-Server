import {  IRecipeFilter, IRecipe } from './recipe.interface';
import RecipeModel from './recipe.model';
import { AppError } from '../../errors/AppError';
import { Types } from 'mongoose';
import { JwtPayload } from '../user/user.utils';

// Create a new recipe
export const createRecipeData = async (payload: IRecipe) => {
  const recipe = await RecipeModel.create(payload);
  return recipe;
};

export const updateRecipe = async (id: string, payload: IRecipe) => {
  const recipe = await RecipeModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  
  return recipe;
};

export const deleteRecipe = async (id: string) => {
  const recipe = await RecipeModel.findByIdAndDelete(id);
  if (!recipe) throw new AppError('Recipe not found', 404);
  return recipe;
};

//a user all recipes api service
export const getUserRecipes = async (userId: string | Types.ObjectId) => {
  const recipes = await RecipeModel.find({ user: new Types.ObjectId(userId) })
    .populate({
      path: 'user'
    })
    .populate({
      path: 'comments.user',
      select: 'name email',
    });
  return recipes;
};

export const getRecipeById = async (id: string) => {
  return await RecipeModel.findById(id).populate('user').populate('comments.user', 'name email');
};

export const getAllRecipes = async (
  filter: IRecipeFilter,
  page: number,
  limit: number
) => {
  const queryConditions: any = {};

  if (filter.title) {
    queryConditions.title = { $regex: filter.title, $options: 'i' }; 
  }

  if (filter.tags && filter.tags.length > 0) {
    queryConditions.tags = { $in: filter.tags };
  }

  if (filter.difficulty) {
    queryConditions.difficulty = filter.difficulty;
  }

  if (typeof filter.isPublished === 'boolean') {
    queryConditions.isPublished = filter.isPublished;
  }

  // Pagination
  const skip = (page - 1) * limit;

  // Find recipes
  const recipes = await RecipeModel.find(queryConditions)
    .populate({
      path: 'user',
      select: 'name email' 
    })
    .populate({
      path: 'comments.user',
      select: 'name email',
    })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .lean(); 

  return recipes;
};



export const rateRecipe = async (id: string, rating: number) => {
  const recipe = await RecipeModel.findById(id);
  if (!recipe) throw new AppError('Recipe not found', 404);

  recipe.ratings.push(rating);
  await recipe.save();
  return recipe;
};



export const commentRecipe = async (user:JwtPayload, id: string, commentId: string) => {
  const recipe = await RecipeModel.findById(id);
  if (!recipe) throw new AppError('Recipe not found', 404);

  recipe.comments.push({ user: user._id, comment: commentId , date: new Date() });
  await recipe.save();
  return recipe;
};

export const upvoteRecipe = async (id: string) => {
  const recipe = await RecipeModel.findByIdAndUpdate(
    id,
    { $inc: { upvotes: 1 } },
    { new: true }
  );
  if (!recipe) throw new AppError('Recipe not found', 404);
  return recipe;
};

export const downvoteRecipe = async (id: string) => {
  const recipe = await RecipeModel.findByIdAndUpdate(
    id,
    { $inc: { downvotes: 1 } },
    { new: true }
  );
  if (!recipe) throw new AppError('Recipe not found', 404);
  return recipe;
};



  
  // Admin deletes any user's recipe
  export const adminDeleteRecipe = async (id: string) => {
    const recipe = await RecipeModel.findByIdAndDelete(id);
    if (!recipe) throw new AppError('Recipe not found', 404);
    return recipe;
  };

  export const publishRecipe = async (id: string) => {
    return await RecipeModel.findByIdAndUpdate(id, { isPublished: true }, { new: true });
  };
  
  export const unpublishRecipe = async (id: string) => {
    return await RecipeModel.findByIdAndUpdate(id, { isPublished: false }, { new: true });
  };
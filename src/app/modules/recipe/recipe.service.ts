import { IRecipeCreate, IRecipeUpdate, IRecipeFilter } from './recipe.interface';
import RecipeModel from './recipe.model';
import { AppError } from '../../errors/AppError';
import { Types } from 'mongoose';

// Create a new recipe
export const createRecipe = async (recipeData: any, userId: Types.ObjectId) => {
    return await RecipeModel.create({ ...recipeData, user: userId });
  };

export const updateRecipe = async (id: string, recipeData: IRecipeUpdate, userId: string) => {
  const recipe = await RecipeModel.findOneAndUpdate(
    { _id: id, user: userId },
    recipeData,
    { new: true, runValidators: true }
  );
  if (!recipe) throw new AppError('Recipe not found or unauthorized', 404);
  return recipe;
};

export const deleteRecipe = async (id: string, userId: string) => {
  const recipe = await RecipeModel.findOneAndDelete({ _id: id, user: userId });
  if (!recipe) throw new AppError('Recipe not found or unauthorized', 404);
  return recipe;
};

export const getRecipeById = async (id: string) => {
  return await RecipeModel.findById(id).populate('comments');
};

export const getAllRecipes = async (filter: IRecipeFilter, page: number, limit: number) => {
  const query = RecipeModel.find({
    ...(filter.name && { name: { $regex: filter.name, $options: 'i' } }),
    ...(filter.title && { title: { $regex: filter.title, $options: 'i' } }),
    ...(filter.ingredients && { ingredients: { $in: filter.ingredients } }),
    ...(filter.tags && { tags: { $in: filter.tags } }),
    ...(filter.keyword && {
      $or: [
        { name: { $regex: filter.keyword, $options: 'i' } },
        { title: { $regex: filter.keyword, $options: 'i' } },
        { description: { $regex: filter.keyword, $options: 'i' } },
      ],
    }),
    ...(filter.minCookingTime && { cookingTime: { $gte: filter.minCookingTime } }),
    ...(filter.maxCookingTime && { cookingTime: { $lte: filter.maxCookingTime } }),
  });

  return await query.skip((page - 1) * limit).limit(limit);
};

export const rateRecipe = async (id: string, rating: number, userId: string) => {
  const recipe = await RecipeModel.findById(id);
  if (!recipe) throw new AppError('Recipe not found', 404);

  recipe.ratings.push(rating);
  await recipe.save();
  return recipe;
};

export const commentRecipe = async (id: string, commentId: Types.ObjectId) => {
  const recipe = await RecipeModel.findById(id);
  if (!recipe) throw new AppError('Recipe not found', 404);

  recipe.comments.push(commentId);
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


  
  // Get all recipes created by a specific user
  export const getUserRecipes = async (userId: Types.ObjectId) => {
    const recipes = await RecipeModel.find({ user: userId });
    return recipes;
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
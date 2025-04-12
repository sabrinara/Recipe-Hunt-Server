import { NextFunction, Request, Response } from 'express';
import * as recipeService from './recipe.service';
import SendResponse from '../../utils/sendResponse';
import { Types } from 'mongoose';


// Create a new recipe
export const createRecipeData = async (req: Request, res: Response) => {
  try {
    const { user, ...recipeData } = req.body;

    if (!user || !Types.ObjectId.isValid(user)) {
      return SendResponse(res, 400, 'error', 'Invalid user ID', {});
    }

    const recipe = await recipeService.createRecipeData({ ...recipeData, user });

    SendResponse(res, 201, 'success', 'Recipe created successfully', { recipe });
  } catch (error) {
    console.error('Error creating recipe:', error);
    SendResponse(res, 500, 'error', 'Internal Server Error', {});
  }
};



//update
export const updateRecipe = async (req: Request, res: Response) => {
  const { id } = req.params;
  const recipe = await recipeService.updateRecipe(id, req.body);
  SendResponse(res, 200, 'success', 'Recipe updated successfully', { recipe });
};

//delete
export const deleteRecipe = async (req: Request, res: Response) => {
  await recipeService.deleteRecipe(req.params.id);
  SendResponse(res, 204, 'success', 'Recipe deleted successfully', {});
};


//get single recipe
export const getRecipeById = async (req: Request, res: Response) => {
  const recipe = await recipeService.getRecipeById(req.params.id);
  SendResponse(res, 200, 'success', 'Recipe fetched successfully', { recipe });
};

// a user all recipes controller
export const getUserRecipes = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const recipes = await recipeService.getUserRecipes(userId);
  SendResponse(res, 200, 'success', 'User recipes fetched successfully', { recipes });
};

//get all recipe
export const getAllRecipes = async (req: Request, res: Response) => {
  const filter = req.query as any;
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);

  const recipes = await recipeService.getAllRecipes(filter, page, limit);

  SendResponse(res, 200, 'success', 'Recipes fetched successfully', { recipes });
};

//rate recipe
export const rateRecipe = async (req: Request, res: Response) => {
  const recipe = await recipeService.rateRecipe(req.params.id, req.body.rating);
  SendResponse(res, 200, 'success', 'Recipe rated successfully', { recipe });
};

//like
export const upvoteRecipe = async (req: Request, res: Response) => {
  const recipe = await recipeService.upvoteRecipe(req.params.id);
  SendResponse(res, 200, 'success', 'Recipe upvoted successfully', { recipe });
};

//dislike
export const downvoteRecipe = async (req: Request, res: Response) => {
  const recipe = await recipeService.downvoteRecipe(req.params.id);
  SendResponse(res, 200, 'success', 'Recipe downvoted successfully', { recipe });
};





// Admin deletes any user's recipe
export const adminDeleteRecipe = async (req: Request, res: Response) => {
  const { id } = req.params;
  await recipeService.adminDeleteRecipe(id);
  SendResponse(res, 204, 'success', 'Recipe deleted successfully by admin', {});
};

// Admin controls

//publish
export const publishRecipe = async (req: Request, res: Response) => {
  const recipe = await recipeService.publishRecipe(req.params.id);
  SendResponse(res, 200, 'success', 'Recipe published', { recipe });
};


//unpublish
export const unpublishRecipe = async (req: Request, res: Response) => {
  const recipe = await recipeService.unpublishRecipe(req.params.id);
  SendResponse(res, 200, 'success', 'Recipe unpublished', { recipe });
};
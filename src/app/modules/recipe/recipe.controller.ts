import { Request, Response } from 'express';
import * as recipeService from './recipe.service';
import SendResponse from '../../utils/sendResponse';


// Create a new recipe
export const createRecipeData = async (req: Request, res: Response) => {
  try {
    const recipe = await recipeService.createRecipeData(req.body);
    SendResponse(res, 201, 'success', 'Recipe created successfully', { recipe });
  } catch (error) {
    console.error('Error creating recipe:', error);
    SendResponse(res, 500, 'error', 'Internal Server Error', {});
  }
};



export const updateRecipe = async (req: Request, res: Response) => {
  const { id } = req.params;
  const recipe = await recipeService.updateRecipe(id, req.body);
  SendResponse(res, 200, 'success', 'Recipe updated successfully', { recipe });
};

export const deleteRecipe = async (req: Request, res: Response) => {
  await recipeService.deleteRecipe(req.params.id, req.user._id);
  SendResponse(res, 204, 'success', 'Recipe deleted successfully', {});
};

export const getRecipeById = async (req: Request, res: Response) => {
  const recipe = await recipeService.getRecipeById(req.params.id);
  SendResponse(res, 200, 'success', 'Recipe fetched successfully', { recipe });
};

export const getAllRecipes = async (req: Request, res: Response) => {
  const filter = req.query;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const recipes = await recipeService.getAllRecipes(filter, page, limit);
  SendResponse(res, 200, 'success', 'Recipes fetched successfully', { recipes });
};

export const rateRecipe = async (req: Request, res: Response) => {
  const recipe = await recipeService.rateRecipe(req.params.id, req.body.rating);
  SendResponse(res, 200, 'success', 'Recipe rated successfully', { recipe });
};

export const upvoteRecipe = async (req: Request, res: Response) => {
  const recipe = await recipeService.upvoteRecipe(req.params.id);
  SendResponse(res, 200, 'success', 'Recipe upvoted successfully', { recipe });
};

export const downvoteRecipe = async (req: Request, res: Response) => {
  const recipe = await recipeService.downvoteRecipe(req.params.id);
  SendResponse(res, 200, 'success', 'Recipe downvoted successfully', { recipe });
};

  
  // Get all recipes created by the logged-in user
  export const getUserRecipes = async (req: Request, res: Response) => {
    const userId = req.user._id; // Get userId from authenticated user
    const recipes = await recipeService.getUserRecipes(userId);
    SendResponse(res, 200, 'success', 'User recipes fetched successfully', { recipes });
  };
  
  // Admin deletes any user's recipe
  export const adminDeleteRecipe = async (req: Request, res: Response) => {
    const { id } = req.params;
    await recipeService.adminDeleteRecipe(id);
    SendResponse(res, 204, 'success', 'Recipe deleted successfully by admin', {});
  };

  // Admin controls
export const publishRecipe = async (req: Request, res: Response) => {
    const recipe = await recipeService.publishRecipe(req.params.id);
    SendResponse(res, 200, 'success', 'Recipe published', { recipe });
  };
  
  export const unpublishRecipe = async (req: Request, res: Response) => {
    const recipe = await recipeService.unpublishRecipe(req.params.id);
    SendResponse(res, 200, 'success', 'Recipe unpublished', { recipe });
  };
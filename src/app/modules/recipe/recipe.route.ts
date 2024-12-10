import express from 'express';
import * as recipeController from './recipe.controller';
import { recipeCreateSchema, recipeUpdateSchema, rateRecipeSchema } from './recipe.validation';
import { adminMiddleware, authenticate } from '../../middlewares/authenticate';
import validateRequest from '../../middlewares/validateRequest';


const router = express.Router();

// Public Routes
router.get('/', recipeController.getAllRecipes);
router.get('/:id', recipeController.getRecipeById);

// Protected Routes
router.use(authenticate);

router.get('/user/my-recipes',recipeController.getUserRecipes); 
router.post('/', validateRequest(recipeCreateSchema),recipeController.createRecipeData);
router.patch('/:id', validateRequest(recipeUpdateSchema), recipeController.updateRecipe);
router.delete('/:id', recipeController.deleteRecipe);
router.post('/:id/rate', validateRequest(rateRecipeSchema), recipeController.rateRecipe);
router.post('/:id/upvote', recipeController.upvoteRecipe);
router.post('/:id/downvote', recipeController.downvoteRecipe);

// Admin Routes
router.use(adminMiddleware);

router.delete('/admin/:id', recipeController.adminDeleteRecipe);
router.patch('/:id/publish', authenticate, adminMiddleware, recipeController.publishRecipe);
router.patch('/:id/unpublish', authenticate, adminMiddleware, recipeController.unpublishRecipe);





export const RecipeRoutes = router;

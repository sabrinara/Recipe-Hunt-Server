import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { RecipeRoutes } from "../modules/recipe/recipe.route";


const router = Router();

const moduleRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/recipe',
    route: RecipeRoutes,
  },

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

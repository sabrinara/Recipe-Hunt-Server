import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { RecipeRoutes } from "../modules/recipe/recipe.route";
import { PaymentRoutes } from "../modules/payment/payment.route";
import { OrderRoutes } from "../modules/order/order.route";


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
  {
    path:'/subscribe',
    route: OrderRoutes,
  },
  {

    path: '/payment',
    route: PaymentRoutes,
  }

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

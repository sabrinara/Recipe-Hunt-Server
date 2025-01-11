import { Router } from 'express';

import { OrderController } from './order.controller';
import { authenticate } from '../../middlewares/authenticate';

const router = Router();

router.post('/create',authenticate, OrderController.createOrder);
router.get('/all', authenticate, OrderController.getCompletedOrdersController);


export const OrderRoutes = router;
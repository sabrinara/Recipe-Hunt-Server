import { Router } from 'express';

import { OrderController } from './order.controller';
import { authenticate } from '../../middlewares/authenticate';

const router = Router();

router.post('/',authenticate, OrderController.createOrder);

export const orderRoutes = router;
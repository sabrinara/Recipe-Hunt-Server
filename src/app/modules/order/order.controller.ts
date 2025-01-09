import { AppError } from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import SendResponse from '../../utils/sendResponse';
import { getCompletedOrders, orderService } from './order.service';

const createOrder = catchAsync(async (req, res) => {
  const userId = req.user?.id; // Ensure `userId` exists
  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  const { plan } = req.body;

  if (!plan || !['premium', 'gold', 'platinum'].includes(plan)) {
    throw new AppError('Invalid or missing subscription plan', 400);
  }

  const result = await orderService({ plan }, userId);

  SendResponse(res, 200, 'success', 'Subscription done successfully', { result });
});




const getCompletedOrdersController = catchAsync(async (req, res) => {
  const completedOrders = await getCompletedOrders();
  res.status(200).json({
    success: true,
    data: completedOrders,
  });
});



export const OrderController = {
  createOrder,
  getCompletedOrdersController,
};

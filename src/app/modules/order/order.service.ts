import { initialPayment } from '../payment/payment.utils';
import UserModel from '../user/user.model';
import { AppError } from '../../errors/AppError';
import OrderModel from './order.model';
import { JwtPayload } from 'jsonwebtoken';

export const orderService = async (payload: { plan: string }, userId: string) => {
  const transactionId = `txn-${Date.now()}`;
  const orderData = { ...payload, transactionId };

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const createOrder = await OrderModel.create({
      user: user._id, // Ensure this maps to the required ObjectId
      status: 'active',
      startDate: new Date(),
      paymentStatus: 'Pending',
      subcriptionPlan: orderData.plan,
      transactionId: orderData.transactionId,
    });

    let price;
    switch (orderData.plan) {
      case 'premium':
        price = 99.99;
        break;
      case 'gold':
        price = 199.99;
        break;
      case 'platinum':
        price = 299.99;
        break;
      default:
        throw new AppError('Invalid subscription plan', 400);
    }

    const paymentData = {
      transactionId,
      price,
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: user.phone,
    };

    const paymentSession = await initialPayment(paymentData);

    return paymentSession;
  } catch (error: any) {
    throw new AppError(error.message || 'Failed to create order', 500);
  }
};


// Fetch completed orders
export const getCompletedOrders = async () => {
  return await OrderModel.find({},'user transactionId subcriptionPlan status startDate endDate paymentStatus');
};
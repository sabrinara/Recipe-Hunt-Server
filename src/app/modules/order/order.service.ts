import { initialPayment } from '../payment/payment.utils';
import UserModel from '../user/user.model';
import { AppError } from '../../errors/AppError';
import { OrderModel } from './order.model';

export const orderService = async (
  userId: string,
  price: number,
  duration: string,
) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  const transactionId = `TXN-${Date.now()}`;

  const payUser = new OrderModel({
    user,
    price,
    duration,
    paymentStatus: 'Pending',
    transactionId,
  });

  await payUser.save();

  const paymentData = {
    transactionId,
    price,
    customerName: user.name,
    customerEmail: user.email,
    customerPhone: user.phone,
  };
  const paymentSession = await initialPayment(paymentData);
  console.log(paymentSession);
  return paymentSession;
};

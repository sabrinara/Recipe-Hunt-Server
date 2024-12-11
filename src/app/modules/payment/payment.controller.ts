import catchAsync from '../../utils/catchAsync';
import { paymentServices } from './payment.service';

const confirmationController = catchAsync(async (req, res) => {
  const { transactionId, status } = req.query;
  const result = await paymentServices.confirmationServices(
    transactionId as string,
    status as string,
  );
  res.send(result);
});

export const PaymentController = {
  confirmationController,
};
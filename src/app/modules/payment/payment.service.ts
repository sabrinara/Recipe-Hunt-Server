import { readFileSync } from 'fs';
import { join } from 'path';
import { verifyPayment } from './payment.utils';
import UserModel from '../user/user.model';
import OrderModel from '../order/order.model';

const confirmationServices = async (transactionId: string) => {
  const verifyResponse = await verifyPayment(transactionId);

  console.log('Verify Response:', verifyResponse); // Debug log

  if (verifyResponse && verifyResponse.pay_status === 'Successful') {
    const order = await OrderModel.findOneAndUpdate(
      { transactionId },
      { paymentStatus: "Paid" },
      { new: true }
    );

    if (order) {
      const userId = order.user;
      await UserModel.findOneAndUpdate(
        { _id: userId },
        { premiumMembership: true },
        { new: true }
      );
    }

    const message = `${transactionId}`;
    const statusClass = 'success';
    const description = 'Your payment was processed successfully. Thank you for your subscription!';

    const filePath = join(__dirname, '../../views/confirmation.html');
    let template = readFileSync(filePath, 'utf-8');
    template = template.replace('{{message}}', message);
    return template;
  } else {
    console.error('Payment status not successful or missing:', verifyResponse); // Debug log
    throw new Error(
      'Unfortunately, your payment could not be processed. Please try again or contact support for assistance.'
    );
  }
};

export const paymentServices = {
  confirmationServices,
};

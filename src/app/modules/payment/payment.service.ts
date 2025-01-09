import { readFileSync } from 'fs';
import { join } from 'path';
import { verifyPayment } from './payment.utils';
import UserModel from '../user/user.model';
import OrderModel from '../order/order.model';

const confirmationServices = async (transactionId: string) => {


  const verifyResponse = await verifyPayment(transactionId);


  let result;
  let message = '';
  let statusClass = '';
  let description = '';

  if (verifyResponse && verifyResponse.pay_status === 'Successful') {
    result = await OrderModel.findOneAndUpdate(
      { transactionId },
      {
        paymentStatus: "Paid"
      });
    const userId = result?.user;
    console.log(userId)

    if (result) {
      await UserModel.findOneAndUpdate({ _id: userId }, {
        premiumMembership: true,
      })
    }

    message = `${transactionId}`
    statusClass = 'success';
    description =
      'Your payment was processed successfully. Thank you for your subscription!';
  } else {
    message = 'Payment Failed';
    statusClass = 'failed';
    description =
      'Unfortunately, your payment could not be processed. Please try again or contact support for assistance.';
  }

  // Debug the resolved file path
  const filePath = join(__dirname, '../../views/confirmation.html');
  console.log(`Resolved file path: ${filePath}`);

  let template = readFileSync(filePath, 'utf-8')

  template = template.replace('{{message}}', message)
  return template;
};

export const paymentServices = {
  confirmationServices,
};
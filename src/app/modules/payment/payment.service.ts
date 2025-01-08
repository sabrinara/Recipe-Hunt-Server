import { readFileSync } from 'fs';
import { join } from 'path';
import { verifyPayment } from './payment.utils';
import OrderModel  from '../order/order.model';
import UserModel from '../user/user.model';

const confirmationServices = async (transactionId: string, status: string) => {


  const verifyResponse = await verifyPayment(transactionId);
  console.log(verifyResponse.pay_status);
  console.log(status);

  let result;
  let message = '';
  let statusClass = '';
  let description = '';

  if (verifyResponse && verifyResponse.pay_status === 'Successful') {
    result = await OrderModel.findOneAndUpdate(
      { transactionId },
      {
        paymentStatus: "Paid",
        status: "Paid"
    });
    await UserModel.findOneAndUpdate(
      {email: result?.user?.email}, 
      { premiumMembership: true});

    message = 'Payment Successful!';
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

  try {
    let template = readFileSync(filePath, 'utf-8');
    template = template
      .replace('{{message}}', message)
      .replace('{{statusClass}}', statusClass)
      .replace('{{description}}', description);

    return template;
  } catch (error) {
    console.error('Error reading template:', error);
    throw new Error('Template file not found or could not be read.');
  }

};

export const paymentServices = {
  confirmationServices,
};
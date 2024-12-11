import { Schema, model } from 'mongoose';
import { IOrder } from './order.interface';


const orderSchema = new Schema<IOrder>(
  {
    user: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending',
    },
    transactionId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
export const OrderModel = model<IOrder>('order', orderSchema);
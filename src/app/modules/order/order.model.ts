import { Schema, model } from 'mongoose';
import { IOrder } from './order.interface';

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    transactionId: {
        type: String,
        required: true,
        unique: true, 
      },
    subcriptionPlan:{
        type: String,
        enum: ['premium', 'gold', 'platinum'], 
        required: true
      },
    status: {
      type: String,
      enum: ['active', 'canceled', 'expired'],
      default: 'active',
    },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    paymentStatus: {
      type: String,
      default: 'Pending',
    },
   
  },
  {
    timestamps: true,
  }
);


const OrderModel = model<IOrder>('order', orderSchema);

export default OrderModel;

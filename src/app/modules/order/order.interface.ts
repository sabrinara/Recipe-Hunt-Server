import { Schema } from "mongoose";

export type IOrder = {
    user: Schema.Types.ObjectId; 
    subcriptionPlan:'premium'|'gold'|'platinum';
    status: 'active' | 'canceled' | 'expired'; 
    startDate: Date;
    endDate?: Date;
    paymentStatus: string;
    transactionId?: string; 
  };
  
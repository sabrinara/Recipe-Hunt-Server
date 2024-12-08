// user/model.ts
import mongoose, { Schema, model } from 'mongoose';
import { IUser } from './user.interface';

const userSchema = new Schema<IUser>({
  name: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  imageUrl: { type: String , required: false},
  phone: { type: String , required: false},
  address: { type: String , required: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isBlocked: { type: Boolean, default: false },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  premiumMembership: { type: Boolean, default: false }
});

const UserModel = model<IUser>('User', userSchema);
export default UserModel;

// user/model.ts
import  { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser } from './user.interface';

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  imageUrl: { type: String },
  phone: { type: String },
  address: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isBlocked: { type: Boolean, default: false },
  follow:{
    type: [Schema.Types.ObjectId],
    ref:"User",
    default:[],
  },
  followers:{
    type: [Schema.Types.ObjectId],
    ref:"User",
    default:[],
  },
  premiumMembership: { type: Boolean, default: false },
});

// Pre-save hook to hash the password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.isCorrectPassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const UserModel = model<IUser>('User', userSchema);
export default UserModel;

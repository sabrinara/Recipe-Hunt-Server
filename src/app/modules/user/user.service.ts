import config from "../../config";
import { AppError } from "../../errors/AppError";
import { IAdminUpdate, IUser, IUserProfileUpdate } from "./user.interface";
import UserModel from "./user.model";
import { createToken } from "./user.utils";
import { Types } from 'mongoose';

export const signupUser = async (userData: Partial<IUser>) => {
  const user = await UserModel.create(userData);

  const jwtPayload = {
    _id: user._id as Types.ObjectId, // Ensure _id is of type ObjectId
    name: user.name,
    email: user.email,
    imageUrl: user.imageUrl,
    phone: user.phone,
    role: user.role,
    address: user.address,
  };

  const token = createToken(jwtPayload, config.jwt_access_secret as string, config.jwt_access_expires_in as string);

  return { user, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email }).select('+password');

  if (!user || !(await user.isCorrectPassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  const jwtPayload = {
    _id: user._id as Types.ObjectId, 
    name: user.name,
    email: user.email,
    imageUrl: user.imageUrl,
    phone: user.phone,
    role: user.role,
    address: user.address,
  };

  const token = createToken(jwtPayload, config.jwt_access_secret as string, config.jwt_access_expires_in as string);

  return { user, token };
};



export const getAllUsers = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  return await UserModel.find({}, 'name email imageUrl role').skip(skip).limit(limit);
};

export const getUserCount = async () => {
  return await UserModel.countDocuments();
};


export const getUserById = async (id: string) => {
  return await UserModel.findById(id);
};

export const updateUserProfile = async (id: string, profileData: IUserProfileUpdate) => {
  return await UserModel.findByIdAndUpdate(id, profileData, { new: true, runValidators: true });
};

export const adminUpdateUser = async (id: string, adminData: IAdminUpdate) => {
  return await UserModel.findByIdAndUpdate(id, adminData, { new: true, runValidators: true });
};

export const deleteUser = async (id: string) => {
  await UserModel.findByIdAndDelete(id);
};

export const followUser = async (currentUserId: string, targetUserId: string) => {
  const currentUser = await UserModel.findById(currentUserId);
  const targetUser = await UserModel.findById(targetUserId);

  if (!currentUser || !targetUser) throw new AppError('User not found', 404);

  // Add the follow relationship
  currentUser.following.push(targetUserId as unknown as Types.ObjectId);
  targetUser.followers.push(currentUserId as unknown as Types.ObjectId);

  await currentUser.save();
  await targetUser.save();
};

export const unfollowUser = async (currentUserId: string, targetUserId: string) => {
  const currentUser = await UserModel.findById(currentUserId);
  const targetUser = await UserModel.findById(targetUserId);

  if (!currentUser || !targetUser) throw new AppError('User not found', 404);

  // Remove the follow relationship
  currentUser.following = currentUser.following.filter((id) => id.toString() !== targetUserId);
  targetUser.followers = targetUser.followers.filter((id) => id.toString() !== currentUserId);

  await currentUser.save();
  await targetUser.save();
};


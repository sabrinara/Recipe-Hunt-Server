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
  return await UserModel.find({}, 'name email imageUrl role address isBlocked followers following premiumMembership').skip(skip).limit(limit);
};

export const getUserCount = async () => {
  return await UserModel.countDocuments();
};


// Fetch single user by ID
export const getUserById = async (_id: string) => {
  if (!Types.ObjectId.isValid(_id)) throw new AppError('Invalid user ID', 400);
  const user = await UserModel.findById(_id);
  if (!user) throw new AppError('User not found', 404);
  return user;
};

// Update user profile
export const updateUserProfile = async (_id: string, profileData: IUserProfileUpdate) => {
  if (!Types.ObjectId.isValid(_id)) throw new AppError('Invalid user ID', 400);
  const updatedUser = await UserModel.findByIdAndUpdate(_id, profileData, {
    new: true,
    runValidators: true,
  });
  if (!updatedUser) throw new AppError('User not found', 404);
  return updatedUser;
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


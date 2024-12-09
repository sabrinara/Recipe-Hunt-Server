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


export const adminUpdateUser = async (_id: string, adminData: IAdminUpdate) => {
  return await UserModel.findByIdAndUpdate(_id, adminData, { new: true, runValidators: true });
};

export const deleteUser = async (_id: string) => {
  await UserModel.findByIdAndDelete(_id);
};

export const followUser = async (payload: {
  userId: string;
  followId: string;
}) => {
  const { userId, followId } = payload;

  const user = await UserModel.findById(userId);
  const followUser = await UserModel.findById(followId);

  if (!user || !followUser) {
    throw new Error('One of the users not found');
  }

  if (user.follow?.includes(followId)) {
    throw new Error('Already follow this user');
  }

  // add follow
  if (!user.follow?.includes(followId)) {
    // Add followId to user's follow array
    await UserModel.findByIdAndUpdate(userId, {
      $push: { follow: followId },
    });

    if (!followUser.followers?.includes(userId)) {
      // Add userId to followUser's followers array
      await UserModel.findByIdAndUpdate(followId, {
        $push: { followers: userId },
      });
    }
  }

  return { message: 'Successfully following' };
};

export const unfollowUser = async (payload: {
  userId: string;
  followId: string;
}) => {
  const { userId, followId } = payload;

  const user = await UserModel.findById(userId);
  const followUser = await UserModel.findById(followId);

  if (!user || !followUser) {
    throw new Error('One of the users not found');
  }

  // Remove follow
  if (user.follow?.includes(followId)) {
    // Remove followId from user's follow array
    await UserModel.findByIdAndUpdate(userId, {
      $pull: { follow: followId },
    });

    // Remove followers
    await UserModel.findByIdAndUpdate(followId, { $pull: { followers: userId } });
  }

  return { user, followUser };
};
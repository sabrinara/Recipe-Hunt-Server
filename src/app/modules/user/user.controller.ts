// user/controller.ts
import { Request, Response, NextFunction } from 'express';
import * as userService from './user.service';
import catchAsync from '../../utils/catchAsync';
import SendResponse from '../../utils/sendResponse';
import { AppError } from '../../errors/AppError';


export const signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { user, token } = await userService.signupUser(req.body);
  SendResponse(res, 201, 'success', 'User signed up successfully', { user, token });
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { user, token } = await userService.loginUser(req.body.email, req.body.password);
  SendResponse(res, 200, 'success', 'User logged in successfully', { user, token });
});

export const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { page = 1, limit = 10 } = req.query;

  const users = await userService.getAllUsers(Number(page), Number(limit));
  const totalUsers = await userService.getUserCount();

  SendResponse(res, 200, 'success', 'Fetched all users successfully', {
    users,
    totalPages: Math.ceil(totalUsers / Number(limit)),
    currentPage: Number(page),
  });
});

export const getUserCount = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const count = await userService.getUserCount();
  SendResponse(res, 200, 'success', 'Fetched user count successfully', { count });
});

// Fetch single user
export const getUserProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await userService.getUserById(req.params.id);
  SendResponse(res, 200, 'success', 'User fetched successfully', { user });
});

// Update user profile
export const updateUserProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await userService.updateUserProfile(req.params.id, req.body);
  SendResponse(res, 200, 'success', 'Profile updated successfully', { user });
});



export const adminUpdateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await userService.adminUpdateUser(req.params.id, req.body);
  SendResponse(res, 200, 'success', 'User updated successfully by admin', { user });
});

export const deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await userService.deleteUser(req.params.id);
  SendResponse(res, 204, 'success', 'User account deleted successfully');
});

export const followUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body
    const result = await userService.followUser(payload);
  
  SendResponse(res, 200, 'success', 'User followed successfully', { result });
});

export const unfollowUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body
    const result =await userService.unfollowUser(payload);
  SendResponse(res, 200, 'success', 'User unfollowed successfully', { result });
});

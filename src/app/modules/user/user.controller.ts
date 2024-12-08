// user/controller.ts
import { Request, Response, NextFunction } from 'express';
import * as userService from './user.service';
import catchAsync from '../../utils/catchAsync';
import SendResponse from '../../utils/sendResponse';


export const signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { user, token } = await userService.signupUser(req.body);
  SendResponse(res, 201, 'success', 'User signed up successfully', { user, token });
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { user, token } = await userService.loginUser(req.body.email, req.body.password);
  SendResponse(res, 200, 'success', 'User logged in successfully', { user, token });
});

export const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const users = await userService.getAllUsers();
  SendResponse(res, 200, 'success', 'Fetched all users successfully', { users });
});

export const getUserProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await userService.getUserById(req.user.id);
  SendResponse(res, 200, 'success', 'Fetched user profile successfully', { user });
});

export const updateUserProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await userService.updateUserProfile(req.user.id, req.body);
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
  await userService.followUser(req.user.id, req.body.userId);
  SendResponse(res, 200, 'success', 'User followed successfully');
});

export const unfollowUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await userService.unfollowUser(req.user.id, req.body.userId);
  SendResponse(res, 200, 'success', 'User unfollowed successfully');
});

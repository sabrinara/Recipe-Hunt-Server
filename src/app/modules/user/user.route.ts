// user/route.ts
import express from 'express';
import * as userController from './user.controller';
import { userSignupSchema, userLoginSchema, userProfileUpdateSchema, adminUpdateSchema, userFollowSchema } from './user.validation';
import { adminMiddleware, authenticate } from '../../middlewares/authenticate';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

// Public routes
router.post('/signup', validateRequest(userSignupSchema), userController.signup);
router.post('/login', validateRequest(userLoginSchema), userController.login);
router.get('/all', userController.getAllUsers);
router.get('/', userController.getUserCount);

// Protected routes
router.use(authenticate); 

// Route in user.router.ts
router.get('/profile', userController.getUserProfile);

router.patch('/profile', validateRequest(userProfileUpdateSchema), userController.updateUserProfile);
router.post('/follow', validateRequest(userFollowSchema), userController.followUser);
router.post('/unfollow', validateRequest(userFollowSchema), userController.unfollowUser);

// Admin routes
router.use(adminMiddleware); // Admin only routes
router.patch('/:id', validateRequest(adminUpdateSchema), userController.adminUpdateUser);
router.delete('/:id', userController.deleteUser);

export const UserRoutes = router;

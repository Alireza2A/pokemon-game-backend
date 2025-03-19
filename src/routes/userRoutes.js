import { Router } from 'express';
import { getAllUsers, createUser, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import validateSchema from '../middleware/validateSchema.js';
import userSchema from '../schemas/user.js';

const userRouter = Router();

// Routes with validation middleware
userRouter.get('/', getAllUsers);
userRouter.get('/:id', getUserById);
userRouter.post('/', validateSchema(userSchema), createUser);
userRouter.put('/:id', validateSchema(userSchema), updateUser);
userRouter.delete('/:id', deleteUser);

// Protected route (example)
userRouter.get('/profile', authMiddleware, (req, res) => {
    res.json(req.user);
});

export default userRouter;

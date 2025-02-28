import { loginAdmin, loginUser, logout, refreshToken, registerAdmin, registerUser } from '../controllers/auth.controller';
import express from 'express';

const router = express.Router();

router.post('/register-admin', registerAdmin);
router.post('/login-admin', loginAdmin);
router.post('/register-user', registerUser);
router.post('/login-user', loginUser);
router.get('/refresh-token', refreshToken);
router.get('/logout', logout);

export default router;
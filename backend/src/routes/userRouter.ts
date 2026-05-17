import express from 'express';
// ייבוא של loginUser בנוסף למה שהיה
import { registerUser, loginUser, getUsers } from '../controllers/userController';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser); // 🌟 השורה החדשה שהייתה חסרה!
router.get('/', getUsers);

export default router;
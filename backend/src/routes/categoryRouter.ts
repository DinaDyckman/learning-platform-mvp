import express from 'express';
import { addCategory, addSubCategory } from '../controllers/categoryController';

const router = express.Router();

router.post('/', addCategory);
router.post('/sub', addSubCategory);

export default router;
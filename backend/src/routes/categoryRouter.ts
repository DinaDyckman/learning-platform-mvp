import express from 'express';
import { addCategory, addSubCategory, getCategories, getSubCategories } from '../controllers/categoryController';

const router = express.Router();

router.get('/', getCategories);
router.get('/sub/:id', getSubCategories);
router.post('/', addCategory);
router.post('/sub', addSubCategory);

export default router;
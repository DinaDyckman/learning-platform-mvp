import { Request, Response } from 'express';
import * as categoryService from '../services/categoryService';

export const addCategory = async (req: Request, res: Response) => {
    try {
        const { name, description, icon } = req.body;
        const category = await categoryService.createCategory(name, description, icon);
        res.status(201).json(category);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const addSubCategory = async (req: Request, res: Response) => {
    try {
        const { name, category_id } = req.body;
        const subCategory = await categoryService.createSubCategory(name, category_id);
        res.status(201).json(subCategory);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
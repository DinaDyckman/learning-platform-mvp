import { Request, Response } from 'express';
import * as promptService from '../services/aiService';

export const generatePrompt = async (req: Request, res: Response) => {
    try {
        const result = await promptService.createPrompt(req.body);
        res.status(201).json({ success: true, data: result });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getHistory = async (req: Request, res: Response) => {
    try {
        // תיקון: מחלצים ישירות ומגדירים כ-string
        const userId = req.params.userId as string;
        
        const history = await promptService.getUserHistory(userId);
        res.status(200).json({ success: true, data: history });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
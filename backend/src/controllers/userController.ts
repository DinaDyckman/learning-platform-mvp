import { Request, Response } from 'express';
import * as userService from '../services/userService';
import User from '../models/userModel';

/**
 * 1. רישום משתמש חדש (Register)
 */
export const registerUser = async (req: Request, res: Response) => {
    try {
        const user = await userService.createUser(req.body);
        
        // החזרת הנתונים יחד עם השדה המיוחד לאנימציית הקונפטי
        res.status(201).json({
            success: true,
            message: 'משתמש נרשם בהצלחה!',
            isNewUser: true, // 🌟 סימון ל-Frontend שזו פעם ראשונה
            data: user
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * 2. התחברות משתמש קיים (Login)
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // 1. חיפוש המשתמש לפי האימייל ב-Database
        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({ success: false, message: 'אימייל או סיסמה שגויים' });
            return;
        }

        // 2. בדיקת הסיסמה
        const isMatch = user.password === password; 
        if (!isMatch) {
            res.status(401).json({ success: false, message: 'אימייל או סיסמה שגויים' });
            return;
        }

        // 3. אם הכל תקין, מחזירים הצלחה
        res.status(200).json({
            success: true,
            message: 'התחברת בהצלחה!',
            isNewUser: false, // 🌟 סימון ל-Frontend שהמשתמש כבר היה קיים
            data: user
        });

    } catch (error: any) {
        console.error('Error in loginUser:', error);
        res.status(500).json({ success: false, message: 'שגיאת שרת פנימית' });
    }
};

/**
 * 3. שליפת כל המשתמשים (לצרכי ניהול)
 */
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // אם הסטטוס הוא 200 (הצלחה) אבל הגענו לכאן, נהפוך אותו ל-500 (שגיאת שרת)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    res.status(statusCode).json({
        message: err.message,
        // מציג את פירוט השגיאה רק בזמן פיתוח (לא ב-Production)
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};



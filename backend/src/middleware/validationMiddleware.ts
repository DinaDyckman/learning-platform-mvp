import { Request, Response, NextFunction } from 'express';

export const validateInput = (req: Request, res: Response, next: NextFunction) => {
    // כרגע רק מדפיס, בהמשך נוסיף כאן בדיקות (כמו אורך טלפון וכו')
    console.log('Input validation passed');
    next();
};
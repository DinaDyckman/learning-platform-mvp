import User from '../models/userModel';

export const createUser = async (userData: any) => {
    // בדיקה אם המשתמש כבר קיים לפי אימייל או טלפון
    const existingUser = await User.findOne({ 
        $or: [{ email: userData.email }, { phone: userData.phone }] 
    });

    if (existingUser) {
        throw new Error('User already exists with this email or phone');
    }

    // יצירת המשתמש בבסיס הנתונים
    const user = await User.create(userData);
    return user;
};

export const getAllUsers = async () => {
    return await User.find();
};
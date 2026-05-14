import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true }, // תוספת: חובה לזיהוי
    password: { type: String, required: true },          // תוספת: חובה לאבטחה
    role: { type: String, enum: ['student', 'admin'], default: 'student' }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
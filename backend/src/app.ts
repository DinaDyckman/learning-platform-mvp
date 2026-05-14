import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import { errorHandler } from './middleware/errorMiddleware';
import userRoutes from './routes/userRouter';
import categoryRoutes from './routes/categoryRouter';

// 1. הגדרות בסיסיות
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// 2. חיבור לבסיס הנתונים (Docker)
connectDB();

// 3. Middlewares
app.use(cors()); // מאפשר ל-Frontend לדבר עם ה-Backend
app.use(express.json()); // מאפשר לשרת לקרוא JSON מהבקשות
app.use('/api/users', userRoutes)
app.use('/api/categories', categoryRoutes);
// 4. בדיקת דופק (Health Check)
app.get('/', (req, res) => {
    res.send('API is running...');
});

// 5. Error Handling Middleware (חייב להיות בסוף!)
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
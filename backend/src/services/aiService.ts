import OpenAI from "openai";
import Prompt from '../models/promptModel';
import Category from '../models/categoryModel';
import SubCategory from '../models/subCategoryModel';
import dotenv from 'dotenv';

dotenv.config();

// אתחול OpenAI עם המפתח מה-.env
const openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY, 
});

/**
 * יצירת פרומפט, פנייה ל-AI ושמירת התוצאה
 */
export const createPrompt = async (promptData: any) => {
    // 1. בדיקת קיום קטגוריה ותת-קטגוריה
    const category = await Category.findById(promptData.category_id);
    const subCategory = await SubCategory.findById(promptData.sub_category_id);

    if (!category || !subCategory) {
        throw new Error('Invalid Category or SubCategory ID');
    }

    // 2. בניית הפרומפט והקשר (Context)
    const fullPrompt = `Subject: ${category.name} - ${subCategory.name}. Question: ${promptData.prompt}`;
    
    // 3. פנייה למודל gpt-4o (היחיד שמאושר למפתח שלך)
    const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: fullPrompt }],
        model: "gpt-4o", 
    });

    const aiResponse = completion.choices[0].message.content || "No response from AI";

    // 4. שמירה בבסיס הנתונים (שימוש ב-as any למניעת שגיאות טיפוס של Mongoose)
    return await Prompt.create({
        user_id: promptData.user_id,
        category_id: promptData.category_id,
        sub_category_id: promptData.sub_category_id,
        prompt: promptData.prompt,
        response: aiResponse,
        tokens: completion.usage?.total_tokens || 0,
        isFavorite: false
    } as any);
};

/**
 * שליפת היסטוריית הפרומפטים למשתמש מסוים
 */
export const getUserHistory = async (userId: string) => {
    return await Prompt.find({ user_id: userId })
        .populate('category_id', 'name')
        .populate('sub_category_id', 'name')
        .sort({ createdAt: -1 });
};
import axios from 'axios';

// כתובת הבסיס של השרת שלך (Backend)
const API_BASE_URL = 'http://localhost:5000/api';

// הגדרת המבנה הנדרש לשליחת שאלה ל-AI (Interface עבור TypeScript)
interface SendPromptPayload {
  user_id: string;
  category_id: string;
  sub_category_id: string;
  prompt: string;
}

/**
 * 1. שליחת שאלה ל-AI ושמירתה ב-Database
 */
export const sendPrompt = async (payload: SendPromptPayload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/prompts`, payload);
    return response.data; // מחזיר את תשובת השרת הכוללת את ה-response של ה-AI
  } catch (error) {
    console.error('Error in sendPrompt:', error);
    throw error;
  }
};

/**
 * 2. שליפת היסטוריית השאלות והתשובות עבור משתמש ספציפי
 */
export const getUserHistory = async (userId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/prompts/history/${userId}`);
    return response.data; // מחזיר מערך של כל השאלות שהמשתמש שאל בעבר
  } catch (error) {
    console.error('Error in getUserHistory:', error);
    throw error;
  }
};

/**
 * 3. שליפת כל הקטגוריות הראשיות מהשרת
 */
export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories`);
    return response.data; // מחזיר את רשימת הקטגוריות (למשל: תכנות, עיצוב וכו')
  } catch (error) {
    console.error('Error in getCategories:', error);
    throw error;
  }
};

/**
 * 4. שליפת תתי-קטגוריות השייכות לקטגוריה ראשית מסוימת
 */
export const getSubCategories = async (categoryId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/subcategories/${categoryId}`);
    return response.data; // מחזיר תתי-קטגוריות המתאימות לקטגוריה שנבחרה
  } catch (error) {
    console.error('Error in getSubCategories:', error);
    throw error;
  }
};

/**
 * 5. יצירת קטגוריה ראשית חדשה (עבור מנהל)
 */
export const createCategory = async (name: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/categories`, { name });
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

/**
 * 6. יצירת תת-קטגוריה חדשה תחת קטגוריה ראשית (עבור מנהל)
 */
export const createSubCategory = async (categoryId: string, name: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/subcategories`, { 
      category_id: categoryId, 
      name 
    });
    return response.data;
  } catch (error) {
    console.error('Error creating subcategory:', error);
    throw error;
  }
};

/**
 * 7. התחברות משתמש קיים
 */
export const loginUser = async (credentials: { email: string; phone: string; password?: string }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/login`, credentials);
    return response.data; 
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

/**
 * 8. רישום משתמש חדש במערכת 🌟 (היה חסר!)
 */
export const registerUser = async (userData: { name: string; email: string; phone: string ,password?:string,role?:string}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/register`, userData);
    return response.data; // מחזיר את נתוני המשתמש החדש שנוצר
  } catch (error) {
    console.error('Error in registerUser:', error);
    throw error;
  }
};
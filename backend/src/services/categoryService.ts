import Category from '../models/categoryModel';
import SubCategory from '../models/subCategoryModel';

export const createCategory = async (name: string, description?: string, icon?: string) => {
    return await Category.create({ name, description, icon });
};

export const createSubCategory = async (name: string, category_id: string) => {
    return await SubCategory.create({ name, category_id });
};

export const getSubCategoriesByCategoryId = async (category_id: string) => {
    return await SubCategory.find({ category_id });
};

export const getAllCategories = async () => {
    // populate('subCategories') יעבוד אם נגדיר virtuals, אבל כרגע פשוט נביא את הקטגוריות
    return await Category.find();
};
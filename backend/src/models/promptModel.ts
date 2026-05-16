import mongoose, { Schema, Document } from 'mongoose';

export interface IPrompt extends Document {
    user_id: mongoose.Types.ObjectId;
    category_id: mongoose.Types.ObjectId;
    sub_category_id: mongoose.Types.ObjectId;
    prompt: string;
    response: string;
    tokens: number;
    isFavorite: boolean;
}

const promptSchema = new Schema<IPrompt>({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category_id: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    sub_category_id: { type: Schema.Types.ObjectId, ref: 'SubCategory', required: true },
    prompt: { type: String, required: true },
    response: { type: String, required: true },
    tokens: { type: Number, default: 0 },
    isFavorite: { type: Boolean, default: false } // הוספת default פותרת את הצורך לשלוח אותו כל פעם
}, { timestamps: true });

export default mongoose.model<IPrompt>('Prompt', promptSchema);
import mongoose from 'mongoose';

const promptSchema = new mongoose.Schema({
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    category_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category', 
        required: true 
    },
    sub_category_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'SubCategory', 
        required: true 
    },
    prompt: { type: String, required: true },
    response: { type: String, required: true },
    
    // תוספות מקצועיות
    tokens: { type: Number, default: 0 },
    isFavorite: { type: Boolean, default: false },
    rating: { type: Number, min: 1, max: 5 }
}, { 
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } 
});

export default mongoose.model('Prompt', promptSchema);
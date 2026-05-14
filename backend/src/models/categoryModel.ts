import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String }, // תוספת: מה לומדים פה?
    icon: { type: String, default: 'default-icon' } // תוספת: שם של אייקון (למשל 'code')
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);
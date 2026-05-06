import mongoose from 'mongoose';
const { Schema } = mongoose;

const Sections = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
});

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    snippet: {
        type: String,
        required: true
    },
    defaultImage: {
        type: String,
        required: true
    },
    blogImage: {
        type: String,
        required: true
    },
    sections: {
        type: [Sections],
        required: true
    },
    spread: {
        type: String,
        required: true,
    },
},{timestamps: true });

export default mongoose.model('Blog', blogSchema);
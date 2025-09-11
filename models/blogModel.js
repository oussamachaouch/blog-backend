const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

module.exports = mongoose.model('Blog',blogSchema);
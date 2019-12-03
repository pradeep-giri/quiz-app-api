const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    question: { type: String, required: true },
    imagePath: { type: String, required: true },
    optionA: { type: String, required: true },
    optionB: { type: String, required: true },
    optionC: { type: String, required: true },
    optionD: { type: String, required: true },
    correctAns: { type: String, required: true }
});

module.exports = mongoose.model('Post', postSchema);
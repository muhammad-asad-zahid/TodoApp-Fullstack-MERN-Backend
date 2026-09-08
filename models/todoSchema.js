const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: [true, 'Title is required'],
        trim: true,
        minlength: [3, 'Title must be at least 3 characters'],
        maxlenght: [100, 'Title cannot exceed 100 charcaters']
    },
    description: {
        type: String,
        trim: true,
        default: "",
        maxlength: [500, "Description cannot exceed 500 characters"],
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User ID is required"],
        index: true,
    },
    status: {
        type: String,
        enum: {
            values: ["pending", "in-progress", "completed"],
            message: "{VALUE} is not a valid status",
        },
        default: "pending",
    },
}, {
    timestamps: true,
})

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo
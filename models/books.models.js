const { timeStamp } = require("console")
const mongoose = require("mongoose")

const booksSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    author: {
        type: String,
    },
    publishedYear: {
        type: Number,
    },
    genre: [
        {
            type: String,
            enum: ["Non-fiction", "Business", "Autobiography", "Adventure", "Fiction", "Psychology"],
        },
    ],
    language: {
        type: String,
    },
    country: {
        type: String,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
    },
    summary: {
        type: String,
    },
    coverImageUrl: {
        type: String,
    },
}, 
{
    timestamps: true
})

const Book = mongoose.model("Book", booksSchema)

module.exports = Book
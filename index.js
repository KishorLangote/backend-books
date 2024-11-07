const express = require("express")
const { rmSync } = require("fs")
require("dotenv").config()
const app = express()

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions)); // middlerware


const { initializeDatabase } = require("./db/db.connect")
const Book = require("./models/books.models")

app.use(express.json()) // middlerware

initializeDatabase() // this means calling the database...

// 1. Create an API with route "/books" to create a new book data in the books Database. Make sure to do error handling. Test your API with Postman. Add the following book:

const books = {
        title: "Lean In",
        author: "Sheryl Sandberg",
        publishedYear: 2012,
        genre: ["Non-fiction", "Business"],
        language: "English",
        country: "United States",
        rating: 4.1,
        summary: "A book about empowering women in the workplace and achieving leadership roles.",
        coverImageUrl: "https://example.com/lean_in.jpg",
      }

     

app.get("/", (req, res) => {
    res.send("Hello, Express server")
})

// app.get("/books", (req, res) => {
//     res.send(books)
// })

// 2. Run your API and create another book data in the db.

// const newBook = {
//     title: "Shoe Dog",
//     author: "Phil Knight",
//     publishedYear: 2016,
//     genre: ["Autobiography", "Business"],
//     language: "English",
//     country: "United States",
//     rating: 4.5,
//     summary: "An inspiring memoir by the co-founder of Nike, detailing the journey of building a global athletic brand.",
//     coverImageUrl: "https://example.com/shoe_dog.jpg"
//   };

// const newBook = {
//     title: "The Alchemist",
//     author: "Paulo Coelho",
//     publishedYear: 1988,
//     genre: ["Fiction", "Adventure"],
//     language: "Portuguese",
//     country: "Brazil",
//     rating: 4.7,
//     summary: "A mystical journey of self-discovery and pursuing one's dreams, following Santiago, a shepherd boy.",
//     coverImageUrl: "https://example.com/the_alchemist.jpg"
// }

const newBook =  {
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    publishedYear: 2011,
    genre: ["Psychology", "Non-fiction"],
    language: "English",
    country: "United States",
    rating: 4.4,
    summary: "An exploration of the two systems that drive our thoughts: intuitive and deliberate thinking.",
    coverImageUrl: "https://example.com/thinking_fast_slow.jpg"
}





//   createNewBook(newBook)

async function createNewBook(newBook){
    try {
        const book = new Book(newBook)
        const saveBook = await book.save()
        console.log("New Book:", saveBook)
    } catch(error){
        throw error
    }
}

// write route for creating & storing a new book entry in a database..

app.post("/books", async (req, res) => {
    try {
        const saveBook = await createNewBook(req.body)
        res.status(201).json({message: "Book added successfullly.", book: saveBook})
    } catch(error) {
        res.status(500).json({error: "Failed to add book."})
    }
})


// 3. Create an API to get all the books in the database as response. Make sure to do error handling.

// get the all books in the database...

async function readAllBooks(){
    try {
        const allBooks = await Book.find()
        return allBooks
    } catch (error) {
       throw error
    }
}

app.get("/books", async (req, res) => {
    try {
        const books = await readAllBooks()
        if(books.length > 0){
            res.json(books)
        } else {
            res.status(404).json({error: "No books found."})
        }
    } catch(error){
        res.status(500).json({error: "Failed to fetch books."})
    }
})

// 4. Create an API to get a book's detail by its title. Make sure to do error handling.

async function readBooksByTitle(bookTitle){
    try {
        const bookByTitle = await Book.find({title: bookTitle})
        return bookByTitle
        //    console.log(bookByTitle)
    } catch (error) {
        throw error
    }
}

readBooksByTitle("Shoe Dog")

app.get("/books/title/:bookTitle", async (req, res) => {
    try {
        const books = await readBooksByTitle(req.params.bookTitle)
        if(books.length > 0){
            res.json(books)
        } else {
            res.status(404).json({error: "No found books."})
        }
    } catch (error) {
        throw error
    }
})


// 5. Create an API to get details of all the books by an author. Make sure to do error handling.

async function readAllBooksByAuthor(bookAuthor){
    try {
        const booksByAuthor = await Book.find({author: bookAuthor})
        return booksByAuthor
    } catch (error) {
        throw error
    }
}

app.get("/books/directory/:bookAuthor", async (req, res) => {
    try {
        const books = await readAllBooksByAuthor(req.params.bookAuthor)
        if(books.length > 0){
            res.json(books)
        }
    } catch (error) {
        res.status(500).json({error: "Failed to fetch books."})
    }
})

// 6. Create an API to get all the books which are of "Business" genre.

async function readAllBooksByGenre(bookGenre){
    try {
        const booksByGenre = await Book.find({genre: bookGenre})
        return booksByGenre
    } catch (error) {
        throw error
    }
}


app.get("/books/genres/:bookGenre", async (req, res) => {
    try {
        const books = await readAllBooksByGenre(req.params.bookGenre)
        if(books.length > 0){
            res.json(books)
        }
    } catch (error){
        res.status(500).json({error: "Failed to fetch books."})
    }
})

// 7. Create an API to get all the books which was released in the year 2012.

// get the all books by realse year in the year 2012

async function readAllBooksByPublishedYear(bookPublishedYear){
    try {
        const booksByPublishedYear = await Book.find({publishedYear: bookPublishedYear})
        return booksByPublishedYear
    } catch (error) {
        throw error
    }
}


app.get("/books/year/:bookPublishedYear", async (req, res) => {
    try {
        const books = await readAllBooksByPublishedYear(req.params.bookPublishedYear)
        if(books.length > 0){
            res.json(books)
        }
    } catch (error) {
        res.status(500).json({error: "Failed to fetch books."})
    }
})

// 8. Create an API to update a book's rating with the help of its id. Update the rating of the "Lean In" from 4.1 to 4.5. Send an error message "Book does not exist", in case that book is not found. Make sure to do error handling.

// Updated book rating: { "rating": 4.5 }


async function updateBookById(bookId, dataToUpdate){
    try {
        const updatedBook = await Book.findByIdAndUpdate(bookId, dataToUpdate, {new: true})
        return updatedBook
    } catch (error){
        throw error
    }
}

 // Update document in the database through postman 

app.post("/books/:bookId", async (req, res) => {
    try {
        const updatedBook = await updateBookById(req.params.bookId, req.body)
        if(updatedBook){
            res.status(200).json({message: "Book updated successfully.", book: updatedBook})
        } else {
            res.status(404).json({error: "No found book."})
        }
    } catch (error) {
       res.status(500).json({error: "Failed to update books database."})
    }
})

// 9. Create an API to update a book's rating with the help of its title. Update the details of the book "Shoe Dog". Use the query .findOneAndUpdate() for this. Send an error message "Book does not exist", in case that book is not found. Make sure to do error handling.

// Updated book data: { "publishedYear": 2017, "rating": 4.2 }

async function updateBookByTitle(bookTitle, dataToUpdate){
    try {
        const updatedBook = await Book.findOneAndUpdate({title: bookTitle}, dataToUpdate, {new: true})
        return updatedBook
    } catch (error){
        throw error
    }
}


app.post("/books/bookTitle", async (req, res) => {
    try {
        const updatedBook = await updateBookByTitle(req.params.bookTitle, req.body)
        if(updatedBook){
            res.status(201).json({message: "Book updated successfully."})
        } else {
            res.status(404).json({error: "Book does not exist."})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to update books database."})
    }
})


// 10. Create an API to delete a book with the help of a book id, Send an error message "Book not found" in case the book does not exist. Make sure to do error handling.

async function deleteBook(bookId){
    try {
        const deletedBook = await Book.findByIdAndDelete(bookId)
        return deletedBook
    } catch (error) {
        throw error
    }
}


app.delete("/books/:bookId", async (req, res) => {
    try {
        const deletedBook = await deleteBook(req.params.bookId)
        if(deletedBook){
            res.status(200).json({message: "Book delelted successfully."})
        } else {
            res.status(404).json({error: "Book not found."})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to deleted book."})
    }
})



const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on the port ${PORT}`)
})
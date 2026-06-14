const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Task 11 requests Axios

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Customer successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop using promise callbacks
public_users.get('/',function (req, res) {
  let get_books = new Promise((resolve, reject) => {
    resolve(books);
  });
  get_books.then((b) => {
      res.status(200).send(JSON.stringify(b, null, 4));
  });
});

// Get book details based on ISBN using promise callbacks
public_users.get('/isbn/:isbn',function (req, res) {
  let get_book = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  });

  get_book.then((b) => {
      res.status(200).send(JSON.stringify(b, null, 4));
  }).catch((err) => {
      res.status(404).json({message: err});
  });
});
  
// Get book details based on author using promise callbacks
public_users.get('/author/:author',function (req, res) {
  let get_books_by_author = new Promise((resolve, reject) => {
    const author = req.params.author;
    const booksByAuthor = [];
    for (const isbn in books) {
        if (books[isbn].author === author) {
            booksByAuthor.push(books[isbn]);
        }
    }
    resolve({booksbyauthor: booksByAuthor});
  });

  get_books_by_author.then((b) => {
      res.status(200).send(JSON.stringify(b, null, 4));
  });
});

// Get all books based on title using promise callbacks
public_users.get('/title/:title',function (req, res) {
  let get_books_by_title = new Promise((resolve, reject) => {
    const title = req.params.title;
    const booksByTitle = [];
    for (const isbn in books) {
        if (books[isbn].title === title) {
            booksByTitle.push(books[isbn]);
        }
    }
    resolve({booksbytitle: booksByTitle});
  });

  get_books_by_title.then((b) => {
      res.status(200).send(JSON.stringify(b, null, 4));
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(books[isbn]) {
      return res.status(200).send(JSON.stringify(books[isbn].reviews,null,4));
  } else {
      return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;

// --- Task 11-14: Axios Implementation ---

/**
 * Task 11: Write a code to get the book list available in the shop using Promise callbacks or async/await with Axios.
 * This function retrieves all books by making an Axios GET request to the root endpoint.
 * It uses async/await to handle the promise effectively.
 */
async function getAllBooksAxios() {
    try {
        // Fetch all books from the server
        let response = await axios.get('http://localhost:5000/');
        console.log("All books retrieved successfully:", response.data);
        return response.data;
    } catch (error) {
        // Handle error if the request fails
        console.error("Error fetching all books:", error);
    }
}

/**
 * Task 12: Write a code to get the book details based on ISBN using Promise callbacks or async/await with Axios.
 * This function retrieves a specific book by making an Axios GET request to the ISBN endpoint.
 * Proper error handling is implemented to catch and log any issues.
 */
async function getBookByIsbnAxios(isbn) {
    try {
        // Fetch book details for the given ISBN
        let response = await axios.get('http://localhost:5000/isbn/' + isbn);
        console.log("Book details retrieved successfully by ISBN:", response.data);
        return response.data;
    } catch (error) {
        // Handle error if the book is not found or request fails
        console.error("Error fetching book by ISBN:", error);
    }
}

/**
 * Task 13: Write a code to get the book details based on author using Promise callbacks or async/await with Axios.
 * This function handles the author parameter, filtering the book data by author via the API.
 * Uses try/catch blocks for robustness.
 */
async function getBookByAuthorAxios(author) {
    try {
        // Fetch book details for the specified author
        let response = await axios.get('http://localhost:5000/author/' + author);
        console.log("Books retrieved successfully by author:", response.data);
        return response.data;
    } catch (error) {
        // Proper HTTP error handling
        console.error("Error fetching books by author:", error);
    }
}

/**
 * Task 14: Write a code to get the book details based on title using Promise callbacks or async/await with Axios.
 * This function sends an Axios request to retrieve book details by title.
 * Validates the promise response and logs the title retrieval.
 */
async function getBookByTitleAxios(title) {
    try {
        // Fetch book details for the given title
        let response = await axios.get('http://localhost:5000/title/' + title);
        console.log("Books retrieved successfully by title:", response.data);
        return response.data;
    } catch (error) {
        // Handle potential errors
        console.error("Error fetching books by title:", error);
    }
}

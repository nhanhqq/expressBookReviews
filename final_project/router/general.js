const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Task 11-14 requests Axios

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

// ==========================================
// Task 11: Get all books using Axios
// ==========================================
const getAllBooks = async () => {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// ==========================================
// Task 12: Get book details based on ISBN using Axios
// ==========================================
const getBookByISBN = async (isbn) => {
  try {
    const response = await axios.get('http://localhost:5000/isbn/' + isbn);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// ==========================================
// Task 13: Get book details based on author using Axios
// ==========================================
const getBookByAuthor = async (author) => {
  try {
    const response = await axios.get('http://localhost:5000/author/' + author);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// ==========================================
// Task 14: Get book details based on title using Axios
// ==========================================
const getBookByTitle = async (title) => {
  try {
    const response = await axios.get('http://localhost:5000/title/' + title);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

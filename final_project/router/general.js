const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Check if username already exists
  if (users.find(user => user.username === username)) {
    return res.status(409).json({ message: 'Username already exists' });
  }

  // Create a new user object
  users.push({"username":username,"password":password});

  res.status(201).json({ message: 'User registered successfully' });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
      const response = await axios.get('http://localhost:5000/');
      res.json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
      const isbn = req.params.isbn;
      const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
      res.json(response.data);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 404) {
        res.status(404).json({ message: 'Book not found' });
      } else {
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  });
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    try {
      const author = req.params.author;
      const response = await axios.get(`http://localhost:5000/author/${author}`);
      res.json(response.data);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 404) {
        res.status(404).json({ message: 'No books found for the given author' });
      } else {
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  });

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    try {
      const title = req.params.title;
      const response = await axios.get(`http://localhost:5000/title/${title}`);
      res.json(response.data);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 404) {
        res.status(404).json({ message: 'No books found for the given title' });
      } else {
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  });

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.json(book.reviews);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

module.exports.general = public_users;

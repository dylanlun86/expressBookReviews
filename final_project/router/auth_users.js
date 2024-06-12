const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

const users = [];

const isValid = (username) => {
  // Check if the username is a non-empty string
  if (typeof username !== 'string' || username.trim().length === 0) {
    return false;
  }

  // Check if the username contains only alphanumeric characters and underscores
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  return usernameRegex.test(username);
};

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }



//only registered users can login
regd_users.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    // Find the user with the provided username
    const user = users.find((user) => user.username === username);
  
    // If user not found or password is incorrect, return an error
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  
    // If credentials are valid, return a success message
    res.json({ message: 'Login successful' });
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.user.username; // Assuming the authenticated user is available in req.user

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!book.reviews[username]) {
    book.reviews[username] = [];
  }

  const existingReview = book.reviews[username].find(r => r === review);
  if (existingReview) {
    return res.status(409).json({ message: "Review already exists" });
  }

  book.reviews[username].push(review);
  res.json({ message: "Review added successfully" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username; // Assuming the authenticated user is available in req.user

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  const userReviews = book.reviews[username] || [];
  if (userReviews.length === 0) {
    return res.status(404).json({ message: "No reviews found for the given book and user" });
  }

  book.reviews[username] = [];
  res.json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

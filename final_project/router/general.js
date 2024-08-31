const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();




// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
 
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});

});

// Get the book list available in the shop


public_users.get('/', function (req, res) {
 
    let myPromise = new Promise((resolve, reject) => {
        if (books) {
          resolve(books);
        } else {
          reject('Cannot Find Books'); 
        }
      });
      
      myPromise.then((books) => { 
        res.send(JSON.stringify({ books }, null, 4));
    })
        .catch((error) => {
        res.status(404).send(error); 
        });

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let myPromise = new Promise((resolve, reject) => {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject('Book with this ISBN not found'); 
        }
      });
      
      myPromise.then((books) => { 
        res.send(books);
    })
        .catch((error) => {
        res.status(404).send(error); 
        });

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    // Convert books object to an array of book entries

    let myPromise = new Promise((resolve, reject) => {
        // Convert books object to an array of book entries and filter by author
        const filtered_books = Object.values(books).filter((book) => book.author === author);
        
        if (filtered_books.length) {
            // If books are found by the author, resolve the promise
            resolve(filtered_books);
        } else {
            // If no books are found, reject the promise
            reject('No books found by this author');
        }
    });

    myPromise.then((books) => {
        // Send the filtered books as a response
        res.send(books);
    })
    .catch((error) => {
        // Handle any errors and send a 404 status with the error message
        res.status(404).send(error);
    });

   
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {

    const title = req.params.title;

    // Convert books object to an array of book entries


        let myPromise = new Promise((resolve, reject) => {
        // Convert books object to an array of book entries and filter by author
        const filtered_titles = Object.values(books).filter((book) => book.title === title);
        
        if (filtered_titles.length) {
            // If books are found by the author, resolve the promise
            resolve(filtered_titles);
        } else {
            // If no books are found, reject the promise
            reject('No books found by this author');
        }
    });

    myPromise.then((books) => {
        // Send the filtered books as a response
        res.send(books);
    })
    .catch((error) => {
        // Handle any errors and send a 404 status with the error message
        res.status(404).send(error);
    });


});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const review = books[isbn].reviews;
    res.send(review);
});

module.exports.general = public_users;

var express = require('express');
var router = express.Router();

//Import the Book model from the ../models folder
const Book = require('../models').Book;

/* 
 * STEP 6
 * Test the Book model and communication with the database 
 */

/* router.get('/', async(req, res, next) =>{
 // res.redirect('/books');
  const books = await Book.findAll();
  res.json(books);
}); */

/* 
 * STEP 8
 * Set up routes
 */

/* Handler function to wrap each route. */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      // Forward error to the global error handler
      next(err);
    }
  };
}

// 8.1 - get / - Home route redirect to the /books route
router.get('/', async (req, res, next) => {
  res.redirect('/books');
});

// 8.2 - GET /books - Shows the full list of books
router.get('/books', asyncHandler(async (req, res, next) => {
  const books = await Book.findAll();
  res.render('index', { books, title: 'New Book' });
}));

// 8.3 - GET /books/new - Shows the create new book form
router.get('/books/new', asyncHandler(async (req, res, next) => {
  //const book = await Book.findAll();
  res.render('new-book', { book: {}, title: 'New book' });
}));

// 8.4 - POST /books/new - Posts a new book to the database
router.post('/books/new', asyncHandler(async (req, res, next) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect('/books');
  }
  catch (error) {
    if (error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      res.render('new-book', {
        book,
        errors: error.errors,
        title: 'New Book',
      });
    } else {
      throw error;
    }
  }
}));

// 8.5 - GET /books/:id - Shows book detail form
router.get('/books/:id', asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render('update-book', { book, title: 'Update Book' });
  } else {
    res.sendStatus(404)
  }
})
)

// 8.6 - post `/books/:id` - Updates book info in the database
router.post('/books/:id', asyncHandler(async (req, res, next) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect('/books');
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body)
      book.id = req.params.id; // make sure correct article gets updated
      res.render('update-book', {
        books, errors: error.errors, title: 'Edit Books'
      })
    } else {
      throw error;
    }
  }
}))

// 8.7 - post `/books/:id/delete` - Deletes a book. 
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.destroy();
  res.redirect('/books')
}))

module.exports = router;

/**
 * @swagger
 * /admin/api/v1/create/book:
 *   post:
 *     tags: ['Books']
 *     summary: Create a new book
 *     description: Adds a new book to the database with a title, author, description, and club ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the book.
 *                 example: "The Great Gatsby"
 *               author:
 *                 type: string
 *                 description: Author of the book.
 *                 example: "F. Scott Fitzgerald"
 *               description:
 *                 type: string
 *                 description: A brief description of the book.
 *                 example: "A novel set in the Roaring Twenties."
 *               clubId:
 *                 type: string
 *                 description: ID of the book club.
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       201:
 *         description: Book successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     club:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "123e4567-e89b-12d3-a456-426614174001"
 *                         title:
 *                           type: string
 *                           example: "The Great Gatsby"
 *                         author:
 *                           type: string
 *                           example: "F. Scott Fitzgerald"
 *                         description:
 *                           type: string
 *                           example: "A novel set in the Roaring Twenties."
 *                         clubId:
 *                           type: string
 *                           example: "123e4567-e89b-12d3-a456-426614174000"
 *       400:
 *         description: Validation error.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/api/v1/get/all/books:
 *   get:
 *     tags: ['Books']
 *     summary: Get all books
 *     description: Retrieves all books from the database.
 *     responses:
 *       200:
 *         description: List of books retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     books:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "123e4567-e89b-12d3-a456-426614174001"
 *                           title:
 *                             type: string
 *                             example: "The Great Gatsby"
 *                           author:
 *                             type: string
 *                             example: "F. Scott Fitzgerald"
 *                           description:
 *                             type: string
 *                             example: "A novel set in the Roaring Twenties."
 *                           clubId:
 *                             type: string
 *                             example: "123e4567-e89b-12d3-a456-426614174000"
 *       404:
 *         description: No books found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/api/v1/get/book/{id}:
 *   get:
 *     tags: ['Books']
 *     summary: Get a book by ID
 *     description: Retrieves a single book by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the book.
 *     responses:
 *       200:
 *         description: Book retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     book:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "123e4567-e89b-12d3-a456-426614174001"
 *                         title:
 *                           type: string
 *                           example: "The Great Gatsby"
 *                         author:
 *                           type: string
 *                           example: "F. Scott Fitzgerald"
 *                         description:
 *                           type: string
 *                           example: "A novel set in the Roaring Twenties."
 *                         clubId:
 *                           type: string
 *                           example: "123e4567-e89b-12d3-a456-426614174000"
 *       400:
 *         description: Validation error.
 *       404:
 *         description: Book not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/api/v1/update/book:
 *   put:
 *     tags: ['Books']
 *     summary: Update a book
 *     description: Updates the details of an existing book.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: string
 *                 description: ID of the book to update.
 *                 example: "123e4567-e89b-12d3-a456-426614174001"
 *               title:
 *                 type: string
 *                 description: New title of the book.
 *                 example: "The Great Gatsby - Updated"
 *               author:
 *                 type: string
 *                 description: New author of the book.
 *                 example: "F. Scott Fitzgerald"
 *               description:
 *                 type: string
 *                 description: Updated description.
 *                 example: "A new updated description."
 *               clubId:
 *                 type: string
 *                 description: Updated club ID.
 *                 example: "123e4567-e89b-12d3-a456-426614174002"
 *     responses:
 *       200:
 *         description: Book updated successfully.
 *       400:
 *         description: Validation error.
 *       404:
 *         description: Book not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/api/v1/delete/book:
 *   delete:
 *     tags: ['Books']
 *     summary: Delete a book
 *     description: Deletes a book by its ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: string
 *                 description: The unique ID of the book to delete.
 *                 example: "123e4567-e89b-12d3-a456-426614174001"
 *     responses:
 *       200:
 *         description: Book successfully deleted.
 *       400:
 *         description: Validation error.
 *       404:
 *         description: Book not found.
 *       500:
 *         description: Internal server error.
 */

const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");
const { Book } = require("../../models/index");

const createBook = async (req, res) => {
  try {
    const schema = Joi.object({
      title: Joi.string().required(),
      author: Joi.string().required(),
      description: Joi.string().optional(),
      clubId: Joi.string().required(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: "fail",
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }
    const newBook = await Book.create({
      id: uuidv4(),
      title: value.title,
      author: value.author,
      description: value.description,
      club_id: value.clubId,
    });

    res.status(201).json({
      status: "success",
      data: {
        club: {
          id: newBook.id,
          title: newBook.title,
          author: newBook.author,
          description: newBook.description,
          clubId: newBook.club_id,
        },
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const updateBook = async (req, res) => {
  try {
    const schema = Joi.object({
      bookId: Joi.string().required(),
      title: Joi.string().optional(),
      author: Joi.string().optional(),
      description: Joi.string().optional(),
      clubId: Joi.string().optional(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: "fail",
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }
    const book = await Book.findOne({ where: { id: value.bookId } });
    if (!book) {
      return res.status(404).json({
        status: "fail",
        message: "Book not found",
      });
    }
    await book.update({
      title: value.title || book.title,
      author: value.author || book.author,
      description: value.description || book.description,
      club_id: value.clubId || book.club_id,
    });
    res.status(200).json({
      status: "success",
      data: {
        book: {
          id: book.id,
          title: book.title,
          author: book.author,
          description: book.description,
          clubId: book.club_id,
        },
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    if (books.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No books found",
      });
    }
    const formattedBooks = books.map((book) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      description: book.description,
      clubId: book.club_id,
    }));
    res.status(200).json({
      status: "success",
      data: {
        books: formattedBooks,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};
const deleteBook = async (req, res) => {
  try {
    const schema = Joi.object({
      bookId: Joi.string().required(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: "fail",
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }
    const book = await Book.findOne({ where: { id: value.bookId } });
    if (!book) {
      return res.status(404).json({
        status: "fail",
        message: "Book not found",
      });
    }
    await book.destroy();
    res.status(200).json({
      status: "success",
      message: "Book successfully deleted",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};
const getBookById = async (req, res) => {
  try {
    const schema = Joi.object({
      id: Joi.string().required(),
    });
    const { error, value } = schema.validate(req.params, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: "fail",
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }
    const book = await Book.findOne({ where: { id: value.id } });
    if (!book) {
      return res.status(404).json({
        status: "fail",
        message: "Book not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        book: {
          id: book.id,
          title: book.title,
          author: book.author,
          description: book.description,
          clubId: book.club_id,
        },
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

module.exports = {
  createBook,
  updateBook,
  getAllBooks,
  deleteBook,
  getBookById,
};

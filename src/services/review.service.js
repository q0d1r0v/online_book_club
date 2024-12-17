/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Review and Comment management APIs
 */

/**
 * @swagger
 * /admin/api/v1/create/review:
 *   post:
 *     tags: [Reviews]
 *     summary: Create a new review for a book
 *     description: Allows a user to create a review for a book, including rating and comment.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               userId:
 *                 type: string
 *                 example: "987e4567-e89b-12d3-a456-426614174000"
 *               rating:
 *                 type: number
 *                 format: int32
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: "Great book! Very informative."
 *     responses:
 *       201:
 *         description: Review created successfully.
 *       400:
 *         description: Validation error.
 *       404:
 *         description: Book or User not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/api/v1/get/reviews/{bookId}:
 *   get:
 *     tags: [Reviews]
 *     summary: Get all reviews with comments for a book
 *     description: Fetch all reviews for a specific book along with the associated comments.
 *     parameters:
 *       - name: bookId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the book to fetch reviews for.
 *     responses:
 *       200:
 *         description: List of reviews fetched successfully, with associated comments.
 *       404:
 *         description: Book not found or no reviews found for the book.
 *       500:
 *         description: Internal server error.
 */

const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");
const { Review, Book, User, Comment } = require("../../models/index");

const createReview = async (req, res) => {
  try {
    const schema = Joi.object({
      bookId: Joi.string().required(),
      userId: Joi.string().required(),
      rating: Joi.number().integer().min(1).max(5).required(),
      comment: Joi.string().required(),
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
    const user = await User.findOne({ where: { id: value.userId } });
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    const newReview = await Review.create({
      id: uuidv4(),
      book_id: value.bookId,
      user_id: value.userId,
      rating: value.rating,
      comment: value.comment,
    });
    res.status(201).json({
      status: "success",
      data: {
        review: {
          id: newReview.id,
          bookId: newReview.book_id,
          userId: newReview.user_id,
          rating: newReview.rating,
          comment: newReview.comment,
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

const getReviewsWithCommentsByBookId = async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findOne({ where: { id: bookId } });
    if (!book) {
      return res.status(404).json({
        status: "fail",
        message: "Book not found",
      });
    }
    const reviews = await Review.findAll({
      where: { book_id: bookId },
      include: [
        {
          model: Comment,
          as: "comments",
          attributes: ["id", "content", "user_id", "createdAt", "updatedAt"],
        },
      ],
    });
    if (!reviews || reviews.length === 0) {
      return res.status(404).json({
        status: "fail",
        data: [],
        message: "No reviews found for this book",
      });
    }
    res.status(200).json({
      status: "success",
      data: reviews.map((review) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        comments: review.comments,
      })),
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

module.exports = { createReview, getReviewsWithCommentsByBookId };

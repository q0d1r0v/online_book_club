/**
 * @swagger
 * /admin/api/v1/create/comment:
 *   post:
 *     tags: ['Comments']
 *     summary: Create a new comment
 *     description: Allows a user to add a comment to a specific review by providing reviewId, userId, and content.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reviewId:
 *                 type: string
 *                 description: The ID of the review to comment on.
 *                 example: "123e4567-e89b-12d3-a456-426614174001"
 *               userId:
 *                 type: string
 *                 description: The ID of the user creating the comment.
 *                 example: "123e4567-e89b-12d3-a456-426614174002"
 *               content:
 *                 type: string
 *                 description: The content of the comment.
 *                 example: "This is an excellent review! Very detailed."
 *     responses:
 *       201:
 *         description: Comment successfully created.
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
 *                     comment:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "uuid-generated-id"
 *                         reviewId:
 *                           type: string
 *                           example: "123e4567-e89b-12d3-a456-426614174001"
 *                         userId:
 *                           type: string
 *                           example: "123e4567-e89b-12d3-a456-426614174002"
 *                         content:
 *                           type: string
 *                           example: "This is an excellent review! Very detailed."
 *       400:
 *         description: Validation error. Missing required fields or invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "fail"
 *                 message:
 *                   type: string
 *                   example: "Validation error"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "content is required"
 *       404:
 *         description: Review or User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "fail"
 *                 message:
 *                   type: string
 *                   example: "Review not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Something went wrong"
 */

const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");
const { Review, Comment, User } = require("../../models/index");

const createComment = async (req, res) => {
  try {
    const schema = Joi.object({
      reviewId: Joi.string().required(),
      userId: Joi.string().required(),
      content: Joi.string().required(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: "fail",
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }
    const review = await Review.findOne({ where: { id: value.reviewId } });
    if (!review) {
      return res.status(404).json({
        status: "fail",
        message: "Review not found",
      });
    }
    const user = await User.findOne({ where: { id: value.userId } });
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    const newComment = await Comment.create({
      id: uuidv4(),
      review_id: value.reviewId,
      user_id: value.userId,
      content: value.content,
    });
    res.status(201).json({
      status: "success",
      data: {
        comment: {
          id: newComment.id,
          reviewId: newComment.review_id,
          userId: newComment.user_id,
          content: newComment.content,
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

module.exports = { createComment };

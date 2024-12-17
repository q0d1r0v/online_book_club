/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags: ['Authentication']
 *     summary: Register a new user
 *     description: Allows a new user to register by providing their username, email, password, and role.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the new user.
 *                 example: "john_doe"
 *               email:
 *                 type: string
 *                 description: The email address of the new user.
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 description: The password for the new user.
 *                 example: "password123"
 *               roleId:
 *                 type: string
 *                 description: The role ID for the new user.
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       201:
 *         description: User successfully registered.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "123e4567-e89b-12d3-a456-426614174000"
 *                         username:
 *                           type: string
 *                           example: "john_doe"
 *                         email:
 *                           type: string
 *                           example: "john@example.com"
 *                         roleId:
 *                           type: string
 *                           example: "123e4567-e89b-12d3-a456-426614174000"
 *       400:
 *         description: Validation error.
 *       404:
 *         description: User already exists or invalid role.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags: ['Authentication']
 *     summary: Log in an existing user
 *     description: Allows a user to log in by providing their email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user logging in.
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 description: The password of the user logging in.
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: User successfully logged in.
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
 *                     accessToken:
 *                       type: string
 *                       description: The access token for the logged-in user.
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwicm9sZUlEIjoiYWJjZGVmZ2hpIiwiaWF0IjoxNjM3MTIzMTQ4LCJleHBpcmVkIjoxNjM3MTIzNzg2In0.FgTRVoe2x-1pfiZ8zXjOlWzF0sDUnAwqrgAeq5-a4d8"
 *                     refreshToken:
 *                       type: string
 *                       description: The refresh token for the logged-in user.
 *                       example: "d3f37ef2ab344fdd9f458f82083ed9b1c8c34d4593bc4d62909c1a4373eae6c7"
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Invalid email or password.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/v1/auth/refresh/token:
 *   post:
 *     tags: ['Authentication']
 *     summary: Refresh an expired access token
 *     description: Allows a user to refresh their expired access token using the refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: The refresh token of the user.
 *                 example: "d3f37ef2ab344fdd9f458f82083ed9b1c8c34d4593bc4d62909c1a4373eae6c7"
 *     responses:
 *       200:
 *         description: Access token successfully refreshed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: The new access token.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwicm9sZUlEIjoiYWJjZGVmZ2hpIiwiaWF0IjoxNjM3MTIzMTQ4LCJleHBpcmVkIjoxNjM3MTIzNzg2In0.FgTRVoe2x-1pfiZ8zXjOlWzF0sDUnAwqrgAeq5-a4d8"
 *       400:
 *         description: Invalid refresh token.
 *       401:
 *         description: Refresh token expired or invalid.
 *       500:
 *         description: Internal server error.
 */

const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const { User, Token } = require("../../models/index");

const register = async (req, res) => {
  try {
    const schema = Joi.object({
      username: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      roleId: Joi.string().uuid().required(),
    });

    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: "fail",
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email: value.email }, { username: value.username }],
      },
    });
    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "Email or username already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(value.password, 10);

    const newUser = await User.create({
      id: uuidv4(),
      username: value.username,
      email: value.email,
      password: hashedPassword,
      role_id: value.roleId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    res.status(201).json({
      status: "success",
      data: {
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          roleId: newUser.role_id,
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
const login = async (req, res) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: "fail",
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const user = await User.findOne({ where: { email: value.email } });
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(value.password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    const accessToken = jwt.sign(
      { userId: user.id, roleId: user.role_id },
      process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: "24h" }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, roleId: user.role_id },
      process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    const existingToken = await Token.findOne({ where: { user_id: user.id } });

    if (existingToken) {
      existingToken.token = refreshToken;
      existingToken.expiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await existingToken.save();
    } else {
      await Token.create({
        id: uuidv4(),
        user_id: user.id,
        role_id: user.role_id,
        token: refreshToken,
        expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;

    const storedToken = await Token.findOne({ where: { token } });
    if (!storedToken) {
      return res
        .status(401)
        .json({ status: "fail", message: "Invalid refresh token" });
    }

    jwt.verify(
      token,
      process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
      async (err, decoded) => {
        if (err) {
          return res.status(401).json({
            status: "fail",
            message: "Refresh token expired or invalid",
          });
        }
        const newAccessToken = jwt.sign(
          { userId: decoded.userId },
          process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
          {
            expiresIn: "24h",
          }
        );
        res.status(200).json({ accessToken: newAccessToken });
      }
    );
  } catch (err) {
    res.status(500).json({ status: "error", message: "Something went wrong" });
  }
};

module.exports = {
  register,
  login,
  refreshToken,
};

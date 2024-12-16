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
    console.log(err);
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
        console.log(decoded);
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

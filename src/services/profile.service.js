/**
 * @swagger
 * tags:
 *   name: Profiles
 *   description: Profile management APIs
 */

/**
 * @swagger
 * /admin/api/v1/create/profile:
 *   post:
 *     tags: [Profiles]
 *     summary: Create a new profile
 *     description: Allows a user to create their profile.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               bio:
 *                 type: string
 *                 example: "This is John's biography."
 *     responses:
 *       201:
 *         description: Profile created successfully.
 *       400:
 *         description: Validation error.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/api/v1/update/profile:
 *   put:
 *     tags: [Profiles]
 *     summary: Update an existing profile
 *     description: Updates user profile details such as first name, last name, and bio.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               firstName:
 *                 type: string
 *                 example: "Jane"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               bio:
 *                 type: string
 *                 example: "Updated biography for Jane Doe."
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *       400:
 *         description: Validation error.
 *       404:
 *         description: Profile not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/api/v1/delete/profile:
 *   delete:
 *     tags: [Profiles]
 *     summary: Delete a profile
 *     description: Deletes a user's profile based on their userId.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Profile deleted successfully.
 *       400:
 *         description: Validation error.
 *       404:
 *         description: Profile not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/api/v1/get/profile:
 *   get:
 *     tags: [Profiles]
 *     summary: Get a profile
 *     description: Fetch a user's profile by userId.
 *     parameters:
 *       - name: userId
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to fetch the profile.
 *     responses:
 *       200:
 *         description: Profile fetched successfully.
 *       400:
 *         description: Validation error.
 *       404:
 *         description: Profile not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/api/v1/get/all/profiles:
 *   get:
 *     tags: [Profiles]
 *     summary: Get all profiles
 *     description: Fetch all user profiles from the database.
 *     responses:
 *       200:
 *         description: List of profiles fetched successfully.
 *       404:
 *         description: No profiles found.
 *       500:
 *         description: Internal server error.
 */

const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");
const { Profile } = require("../../models/index");

const createProfile = async (req, res) => {
  try {
    const schema = Joi.object({
      userId: Joi.string().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      bio: Joi.string().required(),
    });

    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: "fail",
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const profile = await Profile.findOne({ where: { user_id: value.userId } });
    if (!profile) {
      const newProfile = await Profile.create({
        id: uuidv4(),
        user_id: value.userId,
        first_name: value.firstName,
        last_name: value.lastName,
        bio: value.bio,
      });
      res.status(201).json({
        status: "success",
        data: {
          user: {
            id: newProfile.id,
            userId: newProfile.user_id,
            firstName: newProfile.first_name,
            lastName: newProfile.last_name,
            bio: newProfile.bio,
          },
        },
      });
    } else {
      return res.status(400).json({
        status: "fail",
        message: "Profile already exists",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const schema = Joi.object({
      userId: Joi.string().required(),
      firstName: Joi.string().optional(),
      lastName: Joi.string().optional(),
      bio: Joi.string().optional(),
    });

    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: "fail",
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const profile = await Profile.findOne({ where: { user_id: value.userId } });
    if (!profile) {
      return res.status(404).json({
        status: "fail",
        message: "Profile not found",
      });
    }

    const updatedProfile = await profile.update({
      first_name: value.firstName || profile.first_name,
      last_name: value.lastName || profile.last_name,
      bio: value.bio || profile.bio,
    });

    res.status(200).json({
      status: "success",
      data: {
        user: {
          id: updatedProfile.id,
          userId: updatedProfile.user_id,
          firstName: updatedProfile.first_name,
          lastName: updatedProfile.last_name,
          bio: updatedProfile.bio,
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
const deleteProfile = async (req, res) => {
  try {
    const schema = Joi.object({
      userId: Joi.string().required(),
    });

    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: "fail",
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const profile = await Profile.findOne({ where: { user_id: value.userId } });
    if (!profile) {
      return res.status(404).json({
        status: "fail",
        message: "Profile not found",
      });
    }

    await profile.destroy();
    res.status(200).json({
      status: "success",
      message: "Profile deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};
const getProfile = async (req, res) => {
  try {
    const schema = Joi.object({
      userId: Joi.string().required(),
    });

    const { error, value } = schema.validate(req.query, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: "fail",
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const profile = await Profile.findOne({ where: { user_id: value.userId } });
    if (!profile) {
      return res.status(404).json({
        status: "fail",
        message: "Profile not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        user: {
          id: profile.id,
          userId: profile.user_id,
          firstName: profile.first_name,
          lastName: profile.last_name,
          bio: profile.bio,
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
const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.findAll();

    if (profiles.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No profiles found",
      });
    }

    const formattedProfiles = profiles.map((profile) => ({
      id: profile.id,
      userId: profile.user_id,
      firstName: profile.first_name,
      lastName: profile.last_name,
      bio: profile.bio,
    }));

    res.status(200).json({
      status: "success",
      data: {
        users: formattedProfiles,
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
  createProfile,
  updateProfile,
  deleteProfile,
  getProfile,
  getAllProfiles,
};

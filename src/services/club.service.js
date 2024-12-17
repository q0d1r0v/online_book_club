/**
 * @swagger
 * /admin/api/v1/create/club:
 *   post:
 *     tags: ['Clubs']
 *     summary: Create a new club
 *     description: Allows creating a new club by providing name, description, and adminId.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the club.
 *                 example: "Chess Club"
 *               description:
 *                 type: string
 *                 description: A brief description of the club.
 *                 example: "A club for chess enthusiasts."
 *               adminId:
 *                 type: string
 *                 description: The ID of the admin who manages the club.
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       201:
 *         description: Club successfully created.
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
 *                           example: "uuid-generated-id"
 *                         name:
 *                           type: string
 *                           example: "Chess Club"
 *                         description:
 *                           type: string
 *                           example: "A club for chess enthusiasts."
 *                         adminId:
 *                           type: string
 *                           example: "123e4567-e89b-12d3-a456-426614174000"
 *       400:
 *         description: Validation error or club already exists.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/api/v1/get/all/clubs:
 *   get:
 *     tags: ['Clubs']
 *     summary: Retrieve all clubs
 *     description: Fetch a list of all available clubs.
 *     responses:
 *       200:
 *         description: A list of clubs.
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
 *                     clubs:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "uuid-generated-id"
 *                           name:
 *                             type: string
 *                             example: "Chess Club"
 *                           description:
 *                             type: string
 *                             example: "A club for chess enthusiasts."
 *                           adminId:
 *                             type: string
 *                             example: "123e4567-e89b-12d3-a456-426614174000"
 *       404:
 *         description: No clubs found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/api/v1/update/club:
 *   put:
 *     tags: ['Clubs']
 *     summary: Update a club
 *     description: Update details of an existing club.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clubId:
 *                 type: string
 *                 description: The ID of the club to update.
 *                 example: "uuid-generated-id"
 *               name:
 *                 type: string
 *                 description: The new name of the club (optional).
 *                 example: "Advanced Chess Club"
 *               description:
 *                 type: string
 *                 description: The new description of the club (optional).
 *                 example: "Updated description for chess lovers."
 *               adminId:
 *                 type: string
 *                 description: The new admin ID of the club (optional).
 *                 example: "new-admin-uuid"
 *     responses:
 *       200:
 *         description: Club successfully updated.
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
 *                           example: "uuid-generated-id"
 *                         name:
 *                           type: string
 *                           example: "Advanced Chess Club"
 *                         description:
 *                           type: string
 *                           example: "Updated description for chess lovers."
 *                         adminId:
 *                           type: string
 *                           example: "new-admin-uuid"
 *       400:
 *         description: Validation error.
 *       404:
 *         description: Club not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/api/v1/delete/club:
 *   delete:
 *     tags: ['Clubs']
 *     summary: Delete a club
 *     description: Deletes a club by its ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clubId:
 *                 type: string
 *                 description: The ID of the club to delete.
 *                 example: "uuid-generated-id"
 *     responses:
 *       200:
 *         description: Club successfully deleted.
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
 *                   example: "Club successfully deleted"
 *       400:
 *         description: Validation error.
 *       404:
 *         description: Club not found.
 *       500:
 *         description: Internal server error.
 */

const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");
const { Club } = require("../../models/index");

const createClub = async (req, res) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string().optional(),
      adminId: Joi.string().required(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: "fail",
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }
    const club = await Club.findOne({ where: { name: value.name } });
    if (!club) {
      const newClub = await Club.create({
        id: uuidv4(),
        name: value.name,
        description: value.description,
        admin_id: value.adminId,
      });

      res.status(201).json({
        status: "success",
        data: {
          club: {
            id: newClub.id,
            name: newClub.name,
            description: newClub.description,
            adminId: newClub.admin_id,
          },
        },
      });
    } else {
      return res.status(400).json({
        status: "fail",
        message: "Club already exists",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.findAll();
    if (clubs.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No clubs found",
      });
    }
    const formattedClubs = clubs.map((club) => ({
      id: club.id,
      name: club.name,
      description: club.description,
      adminId: club.admin_id,
    }));

    res.status(200).json({
      status: "success",
      data: {
        clubs: formattedClubs,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const updateClub = async (req, res) => {
  try {
    const schema = Joi.object({
      clubId: Joi.string().required(),
      name: Joi.string().optional(),
      description: Joi.string().optional(),
      adminId: Joi.string().optional(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: "fail",
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }
    const club = await Club.findOne({ where: { id: value.clubId } });
    if (!club) {
      return res.status(404).json({
        status: "fail",
        message: "Club not found",
      });
    }
    await club.update({
      name: value.name || club.name,
      description: value.description || club.description,
      admin_id: value.adminId || club.admin_id,
    });
    res.status(200).json({
      status: "success",
      data: {
        club: {
          id: club.id,
          name: club.name,
          description: club.description,
          adminId: club.admin_id,
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
const deleteClub = async (req, res) => {
  try {
    const schema = Joi.object({
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
    const club = await Club.findOne({ where: { id: value.clubId } });
    if (!club) {
      return res.status(404).json({
        status: "fail",
        message: "Club not found",
      });
    }
    await club.destroy();
    res.status(200).json({
      status: "success",
      message: "Club successfully deleted",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

module.exports = { createClub, getAllClubs, updateClub, deleteClub };

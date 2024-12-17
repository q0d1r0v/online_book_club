/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Role management APIs
 */

/**
 * @swagger
 * /admin/api/v1/create/role:
 *   post:
 *     tags: [Roles]
 *     summary: Create a new role
 *     description: Allows the creation of a new role in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Admin"
 *     responses:
 *       201:
 *         description: Role created successfully.
 *       400:
 *         description: Validation error or Role already exists.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/api/v1/get/roles:
 *   get:
 *     tags: [Roles]
 *     summary: Get all roles
 *     description: Fetch all roles from the system.
 *     responses:
 *       200:
 *         description: List of roles fetched successfully.
 *       404:
 *         description: No roles found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/api/v1/delete/role:
 *   delete:
 *     tags: [Roles]
 *     summary: Delete a role
 *     description: Deletes a role based on its roleId.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleId:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Role deleted successfully.
 *       400:
 *         description: Validation error.
 *       404:
 *         description: Role not found.
 *       500:
 *         description: Internal server error.
 */

const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");
const { Role } = require("../../models/index");

const createRole = async (req, res) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: "fail",
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }
    const role = await Role.findOne({ where: { name: value.name } });
    if (!role) {
      const newRole = await Role.create({
        id: uuidv4(),
        name: value.name,
      });

      res.status(201).json({
        status: "success",
        data: {
          role: {
            id: newRole.id,
            name: newRole.name,
          },
        },
      });
    } else {
      return res.status(400).json({
        status: "fail",
        message: "Role already exists",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const getRoles = async (_, res) => {
  try {
    const roles = await Role.findAll();

    if (roles.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No roles found",
      });
    }

    const formattedRoles = roles.map((role) => ({
      id: role.id,
      name: role.name,
    }));

    res.status(200).json({
      status: "success",
      data: {
        roles: formattedRoles,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};
const deleteRole = async (req, res) => {
  try {
    const schema = Joi.object({
      roleId: Joi.string().required(),
    });

    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: "fail",
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const role = await Role.findOne({ where: { id: value.roleId } });
    if (!role) {
      return res.status(404).json({
        status: "fail",
        message: "Role not found",
      });
    }

    await role.destroy();
    res.status(200).json({
      status: "success",
      message: "Role deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};
module.exports = {
  getRoles,
  createRole,
  deleteRole,
};

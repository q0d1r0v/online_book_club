const router = require("express").Router();

const { authenticateToken } = require("../middlewares/auth.midleware");
const { register, login, refreshToken } = require("../services/auth.service");
const {
  createBook,
  updateBook,
  getAllBooks,
  deleteBook,
  getBookById,
} = require("../services/books.service");
const {
  createClub,
  updateClub,
  getAllClubs,
  deleteClub,
} = require("../services/club.service");
const { createComment } = require("../services/comment.service");
const {
  createProfile,
  updateProfile,
  deleteProfile,
  getProfile,
  getAllProfiles,
} = require("../services/profile.service");
const {
  createReview,
  getReviewsWithCommentsByBookId,
} = require("../services/review.service");
const {
  getRoles,
  createRole,
  deleteRole,
} = require("../services/roles.service");

router.use("/admin", authenticateToken);

router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/auth/refresh/token", refreshToken);
router.post("/admin/api/v1/create/profile", createProfile);
router.get("/admin/api/v1/get/profile", getProfile);
router.get("/admin/api/v1/get/all/profiles", getAllProfiles);
router.put("/admin/api/v1/update/profile", updateProfile);
router.delete("/admin/api/v1/delete/profile", deleteProfile);
router.post("/admin/api/v1/create/role", createRole);
router.get("/admin/api/v1/get/roles", getRoles);
router.delete("/admin/api/v1/delete/role", deleteRole);
router.post("/admin/api/v1/create/club", createClub);
router.get("/admin/api/v1/get/all/clubs", getAllClubs);
router.put("/admin/api/v1/update/club", updateClub);
router.delete("/admin/api/v1/delete/club", deleteClub);
router.post("/admin/api/v1/create/book", createBook);
router.get("/admin/api/v1/get/book/:id", getBookById);
router.get("/admin/api/v1/get/all/books", getAllBooks);
router.put("/admin/api/v1/update/book", updateBook);
router.delete("/admin/api/v1/delete/book", deleteBook);
router.post("/admin/api/v1/create/review", createReview);
router.post("/admin/api/v1/create/comment", createComment);
router.get("/admin/api/v1/get/reviews/:bookId", getReviewsWithCommentsByBookId);

module.exports = { router };

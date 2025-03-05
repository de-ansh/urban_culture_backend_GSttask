import express from "express";
import {
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/userController";

const router = express.Router();

router.get("/users", getAllUsers); // Get all users
router.get("/users/:id", getUser); // Get user by ID
router.put("/users/:id", updateUser); // Update user by ID
router.delete("/users/:id", deleteUser); // Delete user by ID

export default router;

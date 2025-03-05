import express from "express";
import {
  createBooking,
  deleteBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
} from "../controllers/bookingController";

const router = express.Router();

router.post("/createBooking", createBooking);

router.get("/", getAllBookings);

router.put("/:id/update", updateBookingStatus);

router.get("/:id", getBookingById);

router.delete("/:id", deleteBooking);

export default router;

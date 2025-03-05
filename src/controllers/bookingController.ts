import { Request, Response } from "express";
import { db } from "../firebase";
import { Booking, BookingStatus } from "../model/bookingsModel";

const bookingRef = db.collection("bookings");
const serviceRef = db.collection("services");

export const createBooking = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { userId, serviceId, bookingDate, startTime, endTime } = req.body;

    if (!userId || !serviceId || !bookingDate || !startTime || !endTime) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }

    const serviceDoc = await serviceRef.doc(serviceId).get();
    if (!serviceDoc.exists) {
      return res.status(404).json({ error: "Service not found" });
    }

    const serviceData = serviceDoc.data();
    const totalBookingAmount = serviceData?.price || 0; // Use service price

    const newBooking: Booking = {
      userId,
      serviceId,
      companyId: serviceData?.companyId,
      bookingDate,
      startTime,
      endTime,
      status: BookingStatus.Pending,
      totalBookingAmount,
    };

    const docRef = await bookingRef.add(newBooking);
    return res.status(201).json({ id: docRef.id, ...newBooking });
  } catch (error) {
    console.error("Error creating booking:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getBookingById = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { bookingId } = req.params;

    const doc = await bookingRef.doc(bookingId).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Booking not found" });
    }

    return res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllBookings = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { userId } = req.query;

    let query = bookingRef;
    if (userId) {
      query = query.where(
        "userId",
        "==",
        userId,
      ) as FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;
    }

    const snapshot = await query.get();
    const bookings = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateBookingStatus = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { bookingId, status } = req.body;
    if (!bookingId || !status) {
      return res
        .status(400)
        .json({ message: "Booking ID and status are required." });
    }

    await db.collection("bookings").doc(bookingId).update({ status });

    return res
      .status(200)
      .json({ message: "Booking status updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating booking status", error });
  }
};

// Delete a booking
export const deleteBooking = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { bookingId } = req.params;

    await bookingRef.doc(bookingId).delete();
    return res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

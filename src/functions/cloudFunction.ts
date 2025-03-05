import * as functions from "firebase-functions/v1";

import express, { Request, Response } from "express";

import * as admin from "firebase-admin";
import { sendGSTInvoice } from "./gstInvoice";

const db = admin.firestore();

export const createEInvoice = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: "Missing bookingId" });
    }

    // Fetch booking details
    const bookingRef = db.collection("bookings").doc(bookingId);
    const bookingDoc = await bookingRef.get();
    if (!bookingDoc.exists) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const bookingData = bookingDoc.data();
    if (!bookingData) {
      return res.status(500).json({ message: "Booking data is undefined" });
    }
    console.log("Booking Data:", bookingData);

    const totalAmount = bookingData.totalBookingAmount;
    if (!totalAmount) {
      return res
        .status(400)
        .json({ message: "Total booking amount is missing" });
    }

    // Fetch user details
    const userDoc = await db.collection("users").doc(bookingData.userId).get();
    if (!userDoc.exists)
      return res.status(404).json({ message: "User not found" });

    const userData = userDoc.data();
    if (!userData)
      return res.status(500).json({ message: "User data is undefined" });

    // Fetch company (service provider) details
    const companyDoc = await db
      .collection("companies")
      .doc(userData.companyId)
      .get();
    if (!companyDoc.exists)
      return res.status(404).json({ message: "Company not found" });

    const companyData = companyDoc.data();

    if (!companyData)
      return res.status(500).json({ message: "Company data is undefined" });
    console.log("Company Data:", companyData.GSTNumber);

    // Calculate GST (Assuming CGST and SGST only)
    const gstRate = 18; // 18% GST
    const cgst = (totalAmount * gstRate) / 200;
    const sgst = (totalAmount * gstRate) / 200;
    const totalGST = cgst + sgst;

    // Save GST details in Firestore
    const gstData = {
      bookingId,
      totalGST,
      cgst,
      sgst,
    };

    console.log("GST Details:", gstData);

    await db.collection("gstDetails").add(gstData);

    // Call the next API (send GST invoice)
    await sendGSTInvoice({
      totalAmount,
      totalGST,
      cgst,
      sgst,
      userData,
      companyData,
    });

    return res
      .status(200)
      .json({
        message: "GST data created and next API triggered successfully",
        gstData,
      });
  } catch (error) {
    console.error("Error creating GST data:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

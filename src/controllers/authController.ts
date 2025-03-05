import * as admin from "firebase-admin";
import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import * as firebase from "firebase-admin/auth";

const auth = firebase.getAuth();



export const signup = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, phone, address, password, companyId } = req.body;

    // Check if email is already in use
    let existingUser;
    try {
      existingUser = await auth.getUserByEmail(email);
    } catch (error) {
      existingUser = null; // User does not exist
    }

    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Ensure phone number format is correct
    if (!phone.startsWith("+")) {
      return res.status(400).json({ message: "Phone number must start with + (e.g., +919876543210)" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in Firebase Authentication
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
      phoneNumber: phone,
    });

    // Save user data in Firestore
    await admin.firestore().collection("users").doc(userRecord.uid).set({
      name,
      email,
      phone,
      address,
      companyId,
      password:hashedPassword,
    });


    // Generate a Firebase Authentication token
    const token = await auth.createCustomToken(userRecord.uid);

    return res.status(201).json({
      message: "User created successfully",
      userId: userRecord.uid,
      token,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Error signing up", error });
  }
};


export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    const snapshot = await admin
      .firestore()
      .collection("users")
      .where("email", "==", email)
      .get();
    if (snapshot.empty) {
      return res.status(400).json({ message: "User not found" });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = await auth.createCustomToken(userDoc.id);

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    return res.status(500).json({ message: "Error logging in", error });
  }
};

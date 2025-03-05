import * as admin from "firebase-admin";
import { Request, Response } from "express";
import { User } from "../model/userModel";

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const usersCollection = db.collection("users");

export const getUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const userDoc = await usersCollection.doc(id).get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ id: userDoc.id, ...userDoc.data() });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching user", error });
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const snapshot = await usersCollection.get();
    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching users", error });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const userUpdates: Partial<User> = req.body;

    await usersCollection.doc(id).update(userUpdates);
    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error updating user", error });
  }
};

// Delete User
export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    await usersCollection.doc(id).delete();

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting user", error });
  }
};

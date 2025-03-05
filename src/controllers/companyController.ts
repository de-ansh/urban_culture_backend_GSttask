import { Request, Response } from "express";
import { db } from "../firebase"; 
import { Company } from "../model/companyModel";


const companyRef = db.collection("companies");

export const createCompany = async (req: Request, res: Response):Promise<any> => {
  try {
    const { name, GSTNumber, phone, address } = req.body;

    if (!name || !GSTNumber || !phone || !address) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    const newCompany: Company = {
      name,
      GSTNumber,
      phone,
      address,
    };

    const docRef = await companyRef.add(newCompany);
    return res.status(201).json({ id: docRef.id, ...newCompany });
  } catch (error) {
    console.error("Error creating company:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


export const getCompanyById = async (req: Request, res: Response):Promise<any> => {
  try {
    const { companyId } = req.params;

    const doc = await companyRef.doc(companyId).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Company not found" });
    }

    return res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Error fetching company:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


export const getAllCompanies = async (req: Request, res: Response):Promise<any> => {
  try {
    const snapshot = await companyRef.get();
    const companies = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return res.status(200).json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


export const updateCompany = async (req: Request, res: Response):Promise<any> => {
  try {
    const { companyId } = req.params;
    const { name, GSTNumber, phone, address } = req.body;

    const doc = await companyRef.doc(companyId).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Company not found" });
    }

    const updatedCompany = {
      name: name || doc.data()?.name,
      GSTNumber: GSTNumber || doc.data()?.GSTNumber,
      phone: phone || doc.data()?.phone,
      address: address || doc.data()?.address,
    };

    await companyRef.doc(companyId).update(updatedCompany);
    return res.status(200).json({ message: "Company updated successfully", ...updatedCompany });
  } catch (error) {
    console.error("Error updating company:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


export const deleteCompany = async (req: Request, res: Response):Promise<any> => {
  try {
    const { companyId } = req.params;

    const doc = await companyRef.doc(companyId).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Company not found" });
    }

    await companyRef.doc(companyId).delete();
    return res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    console.error("Error deleting company:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

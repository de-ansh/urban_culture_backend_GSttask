import { Request, Response } from "express";
import { db } from "../firebase"; // Ensure your Firebase is properly initialized
import { Service } from "../model/servicesModel";

const serviceCollection = db.collection("services");

export const createService = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const newService: Service = req.body;
    const docRef = await serviceCollection.add(newService);
    return res.status(201).json({ id: docRef.id, ...newService });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to create service", details: error });
  }
};

export const getAllServices = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const snapshot = await serviceCollection.get();
    const services: Service[] = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Service,
    );
    return res.status(200).json(services);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to retrieve services", details: error });
  }
};

export const getServiceById = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;
    const doc = await serviceCollection.doc(id).get();
    if (!doc.exists) {
      throw new Error("Can not access service");
    }
    return res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to retrieve service", details: error });
  }
};

export const updateService = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;
    const updatedService: Partial<Service> = req.body;
    await serviceCollection.doc(id).update(updatedService);
    return res.status(200).json({ id, ...updatedService });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to update service", details: error });
  }
};

export const deleteService = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;
    await serviceCollection.doc(id).delete();
    return res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to delete service", details: error });
  }
};

import express from "express";
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} from "../controllers/servicesController";

const router = express.Router();

router.post("/createService", createService); // Protect Create
router.get("/getAllServices", getAllServices); // Protect Get All
router.get("/:id/getServiceById", getServiceById); // Protect Get One
router.put("/:id/updateService", updateService); // Protect Update
router.delete("/:id/deleteService", deleteService); // Protect Delete

export default router;

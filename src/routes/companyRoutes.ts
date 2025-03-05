import express from "express";
import {
  createCompany,
  getCompanyById,
  getAllCompanies,
  updateCompany,
  deleteCompany,
} from "../controllers/companyController";


const router = express.Router();


router.post("/create", createCompany); 
router.get("/:companyId", getCompanyById); 
router.get("/companies", getAllCompanies); 
router.put("/:companyId", updateCompany); 
router.delete("/:companyId", deleteCompany); 

export default router;

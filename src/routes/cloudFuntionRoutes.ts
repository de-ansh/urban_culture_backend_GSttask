import express from "express";
import { createEInvoice } from "../functions/cloudFunction";


const router = express.Router();

router.post("/:id", createEInvoice);


export default router;
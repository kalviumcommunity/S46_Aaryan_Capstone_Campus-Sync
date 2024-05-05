import express from "express";
import * as scoreController from "../controllers/scoreController.js";


const router = express.Router();
const { getScoreData, createScore } = scoreController;

router.get("/details", getScoreData);
router.get("/create", createScore);

export default router;
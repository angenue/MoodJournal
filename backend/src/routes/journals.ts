import express from "express";
import * as JournalsController from "../controllers/journals";

const router = express.Router();

router.get("/", JournalsController.getJournals);

router.get("/:journalId", JournalsController.getJournal);

router.post("/", JournalsController.createJournal);

export default router;
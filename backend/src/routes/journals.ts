import express from "express";
import * as JournalsController from "../controllers/journals";

const router = express.Router();

router.get("/", JournalsController.getJournals);

router.get("/:year", JournalsController.getJournalsByYear);

router.get("/:journalId", JournalsController.getJournal);

router.post("/", JournalsController.createJournal);

//patch is used whenever you want to update resource
router.patch("/:journalId", JournalsController.updateJournal);

router.delete("/:journalId", JournalsController.deleteJournal);

export default router;
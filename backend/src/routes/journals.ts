import express from "express";
import * as JournalsController from "../controllers/journals";

const router = express.Router();

router.get("/", JournalsController.getJournals);

router.get("/:journalId", JournalsController.getJournal);

router.post("/", JournalsController.createJournal);

//patch is used whenever you want to update resource
router.patch("/:journalId", JournalsController.updateJournal);

router.delete("/:journalId", JournalsController.deleteJournal);

router.get('/date/:date', JournalsController.getJournalsByDate);

//router.post("/submitForm", JournalsController.submitJournal);

export default router;
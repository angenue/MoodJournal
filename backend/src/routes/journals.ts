import express from "express";
import * as JournalsController from "../controllers/journals";

const router = express.Router();

router.get("/", JournalsController.getJournals);

router.get("/:year(\\d{4})", JournalsController.getJournalsByYear);

router.get('/:year(\\d{4})/:month(\\d{1,2})', JournalsController.getJournalsByYearAndMonth);

router.get("/:journalId", JournalsController.getJournal);

router.post("/", JournalsController.createJournal);

//patch is used whenever you want to update resource
router.patch("/:journalId", JournalsController.updateJournal);

router.delete("/:journalId", JournalsController.deleteJournal);

export default router;
import { RequestHandler } from "express";
import JournalModel from "../models/journal"


export const  getJournals: RequestHandler = async (req, res, next) => {
    try {
      const journals = await JournalModel.find().exec();
      res.status(200).json(journals);
    } catch(error) {
  
      next(error);
    }
    }
;

export const getJournal: RequestHandler = async (req, res, next) => {
    const journalId = req.params.journalId;

    try {
        const journal = await JournalModel.findById(journalId).exec();
        res.status(200).json(journal);
      
      } catch(error) {
    
        next(error);
      }
      }
  ;

    export const createJournal: RequestHandler = async(req, res, next) => {
        const mood = req.body.mood;
        const journal = req.body.journalEntry;
        const journalDate = req.body.date;

        try {
            const newJournal = await JournalModel.create({
                mood: mood,
                journalEntry: journal,
                date: journalDate,
            });

            res.status(201).json(newJournal);
        }
        catch(error) {
            next(error);
          }
    };
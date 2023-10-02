import { RequestHandler } from "express";
import JournalModel from "../models/journal"
import createHttpError from "http-errors";
import mongoose from "mongoose";


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
      if(!mongoose.isValidObjectId(journalId)) {
        throw createHttpError(400, "Invalid journal id");
      } 


        const journal = await JournalModel.findById(journalId).exec();

        if (!journal) {
          throw  createHttpError(404,"Journal entry not found");
        }

        res.status(200).json(journal);
      
      } catch(error) {
    
        next(error);
      }
      };

      interface CreateJournalBody {
        mood?: string,
        journalEntry?: string,
        date: Date

      }

    export const createJournal: RequestHandler<unknown, unknown, CreateJournalBody, unknown> = async(req, res, next) => {
        const mood = req.body.mood;
        const journalEntry = req.body.journalEntry;
        const date = req.body.date;

        try {
          if (!mood) {
            throw createHttpError(400, "Mood is required");
          }

            const newJournal = await JournalModel.create({
                mood: mood,
                journalEntry: journalEntry,
                date: date,
            });

            res.status(201).json(newJournal);
        }
        catch(error) {
            next(error);
          }
    };
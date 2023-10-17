import { RequestHandler } from "express";
import JournalModel from "../models/journal"
import createHttpError from "http-errors";
import mongoose from "mongoose";
import {MoodOptions} from '../models/journal';


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

      export const getJournalsByYear: RequestHandler<{ year: number }> = async (req, res, next) => {
        const year = req.params.year; // Access the year parameter from the request
      
        // Use the 'year' value to filter journals by year and return the result
        try {
          const journals = await JournalModel.find({
            date: {
              $gte: new Date(`${year}-01-01`),
              $lt: new Date(`${Number(year) + 1}-01-01`)
            }
          }).exec();
      
          res.status(200).json(journals);
        } catch (error) {
          next(error);
        }
      };


      interface CreateJournalBody {
        mood?: string,
        journalEntry?: string,
        }

        export const createJournal: RequestHandler<unknown, unknown, CreateJournalBody & { selectedDate: Date }, unknown> = async (req, res, next) => {
          const mood = req.body.mood;
          const journalEntry = req.body.journalEntry;
          const selectedDate = req.body.selectedDate; // Extract selectedDate from the request body
        
          try {
            if (!mood) {
              throw createHttpError(400, "Mood is required");
            }
        
            const newJournal = await JournalModel.create({
              mood: mood as MoodOptions,
              journalEntry: journalEntry,
              date: selectedDate, // Save selectedDate in the database
            });
        
            res.status(201).json(newJournal);
          } catch (error) {
            next(error);
          }
        };
        

    interface UpdateJournalParams {
      journalId: string,
    }

    interface UpdateJournalBody {
      mood?: string,
      journalEntry?: string,
    }
    

    export const updateJournal: RequestHandler<UpdateJournalParams, unknown, UpdateJournalBody, unknown> = async(req, res, next) => {
      const journalId = req.params.journalId;
      const newMood: MoodOptions = req.body.mood as MoodOptions;

      const newEntry = req.body.journalEntry;

      try {
        if(!mongoose.isValidObjectId(journalId)) {
          throw createHttpError(400, "Invalid journal id");
        } 

        if (!newMood) {
          throw createHttpError(400, "Mood is required");
        }

        const journal = await JournalModel.findById(journalId).exec();

        if(!journal) {
          throw createHttpError(404, "Journal not found");
        }

        journal.mood = newMood;
        journal.journalEntry = newEntry;

        const updatedJournal = await journal.save();

        res.status(200).json(updatedJournal);
        
      } catch(error) {
  
        next(error);
      }
    }

    export const deleteJournal: RequestHandler = async(req, res, next) => {
      const journalId = req.params.journalId;

      try {
        if(!mongoose.isValidObjectId(journalId)) {
          throw createHttpError(400, "Invalid journal id");
        }

        const journal = await JournalModel.findById(journalId).exec();

        if(!journal) {
          throw createHttpError(404, "Journal not found");
        }

        await journal.deleteOne();

        res.sendStatus(204);
       
        
      } catch(error) {
  
        next(error);
      }
    }
import { RequestHandler } from "express";
import JournalModel from "../models/journal"
import createHttpError from "http-errors";
import mongoose from "mongoose";
import {MoodOptions} from '../models/journal';
import { assertIsDefined } from "../util/assertIsDefined";


export const  getJournals: RequestHandler = async (req, res, next) => {
  const authenticatedUserId = req.session.userId;
    try {
      assertIsDefined(authenticatedUserId);

      const journals = await JournalModel.find({userId: authenticatedUserId}).exec();
      res.status(200).json(journals);
    } catch(error) {
  
      next(error);
    }
    }
;

export const getJournal: RequestHandler = async (req, res, next) => {
    const journalId = req.params.journalId;
    const authenticatedUserId = req.session.userId;

    try {
      assertIsDefined(authenticatedUserId);

      if(!mongoose.isValidObjectId(journalId)) {
        throw createHttpError(400, "Invalid journal id");
      } 
        const journal = await JournalModel.findById(journalId).exec();

        if (!journal) {
          throw  createHttpError(404,"Journal entry not found");
        }

        if(!journal.userId.equals(authenticatedUserId)) {
          throw createHttpError(401, "You cannt access this journal");
        }

        res.status(200).json(journal);
      
      } catch(error) {
    
        next(error);
      }
      };

      export const getJournalsByYear: RequestHandler<{ year: number }> = async (req, res, next) => {
        const year = req.params.year; 
        const authenticatedUserId = req.session.userId;
      
        // Use the 'year' value to filter journals by year and return the result
        try {
          assertIsDefined(authenticatedUserId);

          const journals = await JournalModel.find({
            userId: authenticatedUserId,
            date: {
              $gte: new Date(`${year}-01-01`),
              $lt: new Date(`${Number(year) + 1}-01-01`)
            }
          }).exec();

          for (const journal of journals) {
            if (!journal.userId.equals(authenticatedUserId)) {
              throw createHttpError(401, "You cannot access this journal");
            }
          }
      
          res.status(200).json(journals);
        } catch (error) {
          next(error);
        }
      };

      export const getJournalsByYearAndMonth: RequestHandler<{ year: number, month: number }> = async (req, res, next) => {
        const year = req.params.year;
        const month = req.params.month;
        const authenticatedUserId = req.session.userId;
      
        try {
          assertIsDefined(authenticatedUserId);
          const journals = await JournalModel.find({
            userId: authenticatedUserId,
            date: {
              $gte: new Date(`${year}-${month}-01`),
              $lt: new Date(`${year}-${Number(month) + 1}-01`)
            }
          }).exec();

          for (const journal of journals) {
            if (!journal.userId.equals(authenticatedUserId)) {
              throw createHttpError(401, "You cannot access this journal");
            }
          }
      
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
          const selectedDate = req.body.selectedDate; 
          const authenticatedUserId = req.session.userId;
        
          try {
            assertIsDefined(authenticatedUserId);

            if (!mood) {
              throw createHttpError(400, "Mood is required");
            }
        
            const newJournal = await JournalModel.create({
              userId: authenticatedUserId,
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
      const authenticatedUserId = req.session.userId;

      const newEntry = req.body.journalEntry;

      try {
        assertIsDefined(authenticatedUserId);

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

        if(!journal.userId.equals(authenticatedUserId)) {
          throw createHttpError(401, "You cannot access this journal");
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
      const authenticatedUserId = req.session.userId;

      try {
        assertIsDefined(authenticatedUserId);

        if(!mongoose.isValidObjectId(journalId)) {
          throw createHttpError(400, "Invalid journal id");
        }

        const journal = await JournalModel.findById(journalId).exec();

        if(!journal) {
          throw createHttpError(404, "Journal not found");
        }

        if(!journal.userId.equals(authenticatedUserId)) {
          throw createHttpError(401, "You cannot access this journal");
        }

        await journal.deleteOne();

        res.sendStatus(204);
       
        
      } catch(error) {
  
        next(error);
      }
    }
import { InferSchemaType, model, Schema } from "mongoose";

export enum MoodOptions {
    'happy' = 'happy',
    'content' = 'content',
    'neutral' = 'neutral',
    'sad' = 'sad',
    'angry' = 'angry'
  }

const journalSchema = new Schema({
    mood: { type: String, enum: Object.values(MoodOptions), required: true },
    journalEntry: { type: String },
    date: { type: Date, default: Date.now }
});

type Journal = InferSchemaType<typeof journalSchema>;

export default model<Journal>("Journal", journalSchema);
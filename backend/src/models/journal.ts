import { InferSchemaType, model, Schema } from "mongoose";

const journalSchema = new Schema({
    mood: { type: String, enum: ['awesome', 'happy', 'meh', 'depressed', 'angry'], required: true },
    journalEntry: { type: String },
    date: { type: Date, default: Date.now }
});

type Journal = InferSchemaType<typeof journalSchema>;

export default model<Journal>("Journal", journalSchema);
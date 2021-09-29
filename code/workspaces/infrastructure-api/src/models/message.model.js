import mongoose from 'mongoose';
import byDate from './queryHelper/sortByDate';

const { Schema } = mongoose;
const modelName = 'Message';

const MessageSchema = new Schema({
  message: { type: String, required: true },
  expiry: { type: Date, required: true },
  created: { type: Date, default: Date.now },
});

MessageSchema.query.sortByCreated = byDate.sortByCreated;
MessageSchema.query.sortByExpiry = byDate.sortByExpiry;

mongoose.model(modelName, MessageSchema, 'messages');

export default { modelName };

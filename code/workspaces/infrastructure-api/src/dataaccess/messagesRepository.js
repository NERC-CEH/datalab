import database from '../config/database';
import messageModel from '../models/message.model';

const MessageModel = () => database.getModel(messageModel.modelName);

async function createMessage(message) {
  const [document] = await MessageModel().create([message], { setDefaultsOnInsert: true });
  return document;
}

async function deleteMessage(id) {
  const result = await MessageModel()
    .deleteOne({ _id: id })
    .exec();
  return result;
}

async function getActiveMessages() {
  // Get the messages that have not yet expired.
  const now = Date.now();
  const documents = await MessageModel().find({ expiry: { $gt: now } }).sortByCreated('desc').exec();
  return documents;
}

async function getAll() {
  return MessageModel().find().sortByCreated('desc').exec();
}

export default {
  createMessage,
  deleteMessage,
  getActiveMessages,
  getAll,
};

import { matchedData } from 'express-validator';
import messagesRepository from '../dataaccess/messagesRepository';

async function createMessage(request, response, next) {
  const { message, expiry } = matchedData(request);

  try {
    const createdMessage = await messagesRepository.createMessage({ message, expiry });
    return response.status(201).send(createdMessage);
  } catch (error) {
    return next(new Error(`Error creating message - failed to create new document: ${error.message}`));
  }
}

async function deleteMessage(request, response, next) {
  const { id } = matchedData(request);

  try {
    const result = await messagesRepository.deleteMessage(id);
    if (result.n === 0) {
      return response.status(404).send({ id });
    }
    return response.status(200).send({ id });
  } catch (error) {
    return next(new Error(`Error deleting message: ${error.message}`));
  }
}

async function getActiveMessages(_, response, next) {
  try {
    const messages = await messagesRepository.getActiveMessages();
    return response.status(200).send(messages);
  } catch (error) {
    return next(new Error(`Error retrieving active messages: ${error.message}`));
  }
}

async function getAllMessages(_, response, next) {
  try {
    const messages = await messagesRepository.getAll();
    return response.status(200).send(messages);
  } catch (error) {
    return next(new Error(`Error retrieving all messages: ${error.message}`));
  }
}

export default {
  createMessage,
  deleteMessage,
  getActiveMessages,
  getAllMessages,
};

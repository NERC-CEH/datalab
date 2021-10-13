import { gqlMutation, gqlQuery } from './graphqlClient';
import errorHandler from './graphqlErrorHandler';

async function createMessage(message) {
  const mutation = `
    CreateMessage($message: MessageCreationRequest!) {
      createMessage(message: $message) {
        id
        message
        expiry
        created
      }
    }
  `;

  const response = await gqlMutation(mutation, { message });
  return errorHandler('data.createMessage')(response);
}

async function deleteMessage(messageId) {
  const mutation = `
    DeleteMessage($messageId: ID!) {
      deleteMessage(messageId: $messageId) {
        id
      }
    }`;

  const response = await gqlMutation(mutation, { messageId });
  return errorHandler('data')(response);
}

async function getMessages() {
  const query = `
    GetMessages {
      messages {
        id
        message
        expiry
        created
      }
    }
  `;

  const response = await gqlQuery(query);
  return errorHandler('data')(response);
}

async function getAllMessages() {
  const query = `
    GetAllMessages {
      allMessages {
        id
        message
        expiry
        created
      }
    }
  `;

  const response = await gqlQuery(query);
  return errorHandler('data')(response);
}

export default { createMessage, deleteMessage, getMessages, getAllMessages };

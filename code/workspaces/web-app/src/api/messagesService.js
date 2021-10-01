import { gqlMutation, gqlQuery } from './graphqlClient';
import errorHandler from './graphqlErrorHandler';

function createMessage(message) {
  const mutation = `
    CreateMessage($cluster: ClusterCreationRequest!) {
      createMessage(cluster: $cluster) {
        id
        message
        expiry
        created
      }
    }
  `;

  return gqlMutation(mutation, { message })
    .then(errorHandler('data.createMessage'));
}

function deleteMessage(messageId) {
  const mutation = `
    DeleteMessage($messageId: ID!) {
      deleteMessage(messageId: $messageId) {
        id
      }
    }`;

  return gqlMutation(mutation, { messageId })
    .then(errorHandler('data'));
}

function getMessages() {
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

  return gqlQuery(query)
    .then(errorHandler('data'));
}

function getAllMessages() {
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

  return gqlQuery(query)
    .then(errorHandler('data'));
}

export default { createMessage, deleteMessage, getMessages, getAllMessages };

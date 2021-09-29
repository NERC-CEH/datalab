import * as expressValidator from 'express-validator';
import messagesRepository from '../dataaccess/messagesRepository';
import messagesController from './messagesController';

jest.mock('../dataaccess/messagesRepository');

const matchedDataMock = jest
  .spyOn(expressValidator, 'matchedData')
  .mockImplementation(request => request);

const responseMock = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
};
const nextMock = jest.fn();

const createMessageRequest = () => ({
  message: 'This is a message',
  expiry: '2021-10-10T10:00:00.000Z',
});
const deleteMessageRequest = () => ({
  id: '1234',
});
const messageDocument = () => ({
  ...createMessageRequest(),
  _id: '1234',
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('messagesController', () => {
  describe('createMessage', () => {
    const { createMessage } = messagesController;

    it('calls matched data to get the message information', async () => {
      // Arrange
      const requestMock = { };

      // Act
      await createMessage(requestMock, responseMock, nextMock);

      // Assert
      expect(matchedDataMock).toHaveBeenCalledWith(requestMock);
    });

    it('creates new message document and returns the newly created document with 201 status', async () => {
      // Arrange
      const requestMock = createMessageRequest();
      const document = messageDocument();
      messagesRepository.createMessage.mockResolvedValueOnce(document);

      // Act
      const returnValue = await createMessage(requestMock, responseMock, nextMock);

      // Assert
      expect(messagesRepository.createMessage).toHaveBeenCalledWith({ ...requestMock });
      expect(returnValue).toBe(responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(201);
      expect(responseMock.send).toHaveBeenCalledWith(document);
    });

    it('calls next with an error if there is an error when creating the new message document', async () => {
      // Arrange
      const requestMock = createMessageRequest();
      messagesRepository.createMessage.mockRejectedValueOnce(new Error('Expected test error'));

      // Act
      await createMessage(requestMock, responseMock, nextMock);

      // Assert
      expect(nextMock).toHaveBeenCalledWith(new Error('Error creating message - failed to create new document: Expected test error'));
    });
  });

  describe('deleteMessage', () => {
    const { deleteMessage } = messagesController;

    it('calls matched data to get the message information', async () => {
      // Arrange
      const requestMock = deleteMessageRequest();

      // Act
      await deleteMessage(requestMock, responseMock, nextMock);

      // Assert
      expect(matchedDataMock).toHaveBeenCalledWith(requestMock);
    });

    it('returns response configured with 404 status if something goes wrong in deletion from mongo', async () => {
      // Arrange
      messagesRepository.deleteMessage.mockResolvedValueOnce({ ok: 0 });
      const requestMock = deleteMessageRequest();

      // Act
      const returnValue = await deleteMessage(requestMock, responseMock, nextMock);

      // Assert
      expect(returnValue).toBe(responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(404);
      expect(responseMock.send).toHaveBeenCalledWith(requestMock);
    });

    it('returns response configured with 200 status if message can be deleted from mongo', async () => {
      // Arrange
      messagesRepository.deleteMessage.mockResolvedValueOnce({ ok: 1 });
      const requestMock = deleteMessageRequest();

      // Act
      const returnValue = await deleteMessage(requestMock, responseMock, nextMock);

      // Assert
      expect(returnValue).toBe(responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(200);
      expect(responseMock.send).toHaveBeenCalledWith(requestMock);
    });

    it('calls next with an error if there is an error when deleting the message', async () => {
      // Arrange
      const requestMock = deleteMessageRequest();
      messagesRepository.deleteMessage.mockRejectedValueOnce(new Error('Expected test error'));

      // Act
      await deleteMessage(requestMock, responseMock, nextMock);

      // Assert
      expect(nextMock).toHaveBeenCalledWith(new Error('Error deleting message: Expected test error'));
    });
  });

  describe('getActiveMessages', () => {
    const { getActiveMessages } = messagesController;

    it('calls to get messages that have not expired and returns response configured with 200 status and array of messages', async () => {
      // Arrange
      const requestMock = {};
      const messages = [messageDocument()];
      messagesRepository.getActiveMessages.mockResolvedValueOnce(messages);

      // Act
      const returnValue = await getActiveMessages(requestMock, responseMock, nextMock);

      // Assert
      expect(returnValue).toBe(responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(200);
      expect(responseMock.send).toHaveBeenCalledWith(messages);
    });

    it('calls next with an error if there is an error when retrieving the messages', async () => {
      // Arrange
      const requestMock = {};
      messagesRepository.getActiveMessages.mockRejectedValueOnce(new Error('Expected test error'));

      // Act
      await getActiveMessages(requestMock, responseMock, nextMock);

      // Assert
      expect(nextMock).toHaveBeenCalledWith(new Error('Error retrieving active messages: Expected test error'));
    });
  });

  describe('getAllMessages', () => {
    const { getAllMessages } = messagesController;

    it('calls to get all messages and returns response configured with 200 status and array of messages', async () => {
      // Arrange
      const requestMock = {};
      const messages = [messageDocument()];
      messagesRepository.getAll.mockResolvedValueOnce(messages);

      // Act
      const returnValue = await getAllMessages(requestMock, responseMock, nextMock);

      // Assert
      expect(returnValue).toBe(responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(200);
      expect(responseMock.send).toHaveBeenCalledWith(messages);
    });

    it('calls next with an error if there is an error when retrieving the messages', async () => {
      // Arrange
      const requestMock = {};
      messagesRepository.getAll.mockRejectedValueOnce(new Error('Expected test error'));

      // Act
      await getAllMessages(requestMock, responseMock, nextMock);

      // Assert
      expect(nextMock).toHaveBeenCalledWith(new Error('Error retrieving all messages: Expected test error'));
    });
  });
});

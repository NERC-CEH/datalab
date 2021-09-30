import messagesRepository from './messagesRepository';
import database from '../config/database';

const messageModelMock = {
  create: jest.fn(),
  exec: jest.fn(),
  find: jest.fn().mockReturnThis(),
  sortByCreated: jest.fn().mockReturnThis(),
  deleteOne: jest.fn().mockReturnThis(),
};

jest.mock('../config/database');
database.getModel.mockReturnValue(messageModelMock);

const createMessageRequest = () => ({
  message: 'This is a message',
  expiry: '2021-10-10T10:00:00.000Z',
});
const messageDocument = () => ({
  ...createMessageRequest(),
  _id: '1234',
});

describe('messagesRepository', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('createMessage', () => {
    it('calls to create new message document and returns the newly created document', async () => {
      // Arrange
      const message = createMessageRequest();
      const document = messageDocument();
      messageModelMock.create.mockReturnValueOnce([document]);

      // Act
      const response = await messagesRepository.createMessage(message);

      // Assert
      expect(messageModelMock.create).toHaveBeenCalledWith([message], { setDefaultsOnInsert: true });
      expect(response).toEqual(document);
    });
  });

  describe('deleteMessage', () => {
    it('deletes a message', async () => {
      // Act
      await messagesRepository.deleteMessage('1234');

      // Assert
      expect(messageModelMock.deleteOne).toHaveBeenCalledWith({ _id: '1234' });
      expect(messageModelMock.exec).toHaveBeenCalledWith();
    });
  });

  describe('getActiveMessages', () => {
    it('gets messages that have not expired', async () => {
      // Arrange
      const document = messageDocument();
      messageModelMock.exec.mockReturnValueOnce([document]);
      jest.spyOn(Date, 'now').mockReturnValueOnce(100000);

      // Act
      const response = await messagesRepository.getActiveMessages();

      // Assert
      expect(messageModelMock.find).toHaveBeenCalledWith({ expiry: { $gt: 100000 } });
      expect(messageModelMock.sortByCreated).toHaveBeenCalledWith('desc');
      expect(response).toEqual([document]);
    });
  });

  describe('getAll', () => {
    it('gets all messages', async () => {
      // Arrange
      const document = messageDocument();
      messageModelMock.exec.mockReturnValueOnce([document]);

      // Act
      const response = await messagesRepository.getAll();

      // Assert
      expect(messageModelMock.find).toHaveBeenCalledWith();
      expect(messageModelMock.sortByCreated).toHaveBeenCalledWith('desc');
      expect(response).toEqual([document]);
    });
  });
});

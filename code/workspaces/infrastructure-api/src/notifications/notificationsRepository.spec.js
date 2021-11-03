import notificationsRepository from './notificationsRepository';
import database from '../config/database';

jest.mock('../config/database');

const createNotificationRequest = () => ({
  title: 'Title ABC',
  message: 'This is a message',
  userIDs: 'auth0|1234,auth0|5678',
});
const notificationDocument = () => ({
  ...createNotificationRequest(),
  _id: '1234',
});

describe('messagesRepository', () => {
  let notificationModelMock;
  beforeEach(() => {
    notificationModelMock = {
      create: jest.fn(),
      exec: jest.fn(),
      find: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      deleteOne: jest.fn().mockReturnThis(),
    };

    database.getModel.mockReturnValue(notificationModelMock);
  });

  describe('createNotification', () => {
    it('calls to create new notification document and returns the newly created document', async () => {
      const notification = createNotificationRequest();
      const document = notificationDocument();
      notificationModelMock.create.mockReturnValueOnce([document]);

      const response = await notificationsRepository.createNotification(notification);

      expect(notificationModelMock.create).toHaveBeenCalledWith([notification], { setDefaultsOnInsert: true });
      expect(response).toEqual(document);
    });
  });

  describe('deleteNotification', () => {
    it('deletes a notification', async () => {
      await notificationsRepository.deleteNotification('1234');

      // Assert
      expect(notificationModelMock.deleteOne).toHaveBeenCalledWith({ _id: '1234' });
      expect(notificationModelMock.exec).toHaveBeenCalledWith();
    });
  });

  describe('getAll', () => {
    it('gets all notifications', async () => {
      const document = notificationDocument();
      notificationModelMock.exec.mockReturnValueOnce([document]);

      const response = await notificationsRepository.getAll();

      expect(notificationModelMock.find).toHaveBeenCalledWith();
      expect(notificationModelMock.sort).toHaveBeenCalledWith({ created: 'desc' });
      expect(response).toEqual([document]);
    });
  });
});

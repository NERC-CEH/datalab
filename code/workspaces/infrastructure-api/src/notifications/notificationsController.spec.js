import * as expressValidator from 'express-validator';
import axios from 'axios';
import notificationsRepository from './notificationsRepository';
import notificationsController from './notificationsController';
import config from '../config/config';
import emailNotificiationAdapter from './adapters/emailNotificationAdapter';

jest.mock('./notificationsRepository');
jest.mock('./adapters/emailNotificationAdapter');
jest.mock('../config/config');
jest.mock('axios');

const matchedDataMock = jest
  .spyOn(expressValidator, 'matchedData')
  .mockImplementation(request => request);

const responseMock = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
};
const nextMock = jest.fn();

const notificationBody = {
  title: 'Title ABC',
  message: 'This is a message',
  userIDs: 'auth0|1234,auth0|5678',
};
const createNotificationRequest = () => ({
  ...notificationBody,
  headers: {
    authorization: 'token1234',
  },
});
const deleteNotificationRequest = () => ({
  id: '1234',
});
const notificationDocument = () => ({
  ...notificationBody,
  _id: '1234',
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('notificationsController', () => {
  describe('sendNotification', () => {
    const { sendNotification } = notificationsController;
    let requestMock;
    beforeEach(() => {
      requestMock = createNotificationRequest();
    });

    it('calls matched data to get the message information', async () => {
      await sendNotification(requestMock, responseMock, nextMock);

      expect(matchedDataMock).toHaveBeenCalledWith(requestMock);
    });

    it('creates new notification document and sends the notification via each adapter', async () => {
      const document = notificationDocument();
      config.get.mockReturnValue('auth-url:1234');
      axios.get
        .mockResolvedValueOnce({ data: { name: 'user1@example.com' } })
        .mockResolvedValueOnce({ data: { name: 'user2@example.com' } });
      notificationsRepository.createNotification.mockResolvedValueOnce(document);

      // Act
      const returnValue = await sendNotification(requestMock, responseMock, nextMock);

      // Assert
      expect(notificationsRepository.createNotification).toHaveBeenCalledWith(notificationBody);
      expect(emailNotificiationAdapter.send).toHaveBeenCalledWith({
        title: 'Title ABC',
        message: 'This is a message',
        userEmails: ['user1@example.com', 'user2@example.com'],
      });
      expect(returnValue).toBe(responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(201);
      expect(responseMock.send).toHaveBeenCalledWith(document);
    });

    it('calls next with an error if there is an error when creating the new notification', async () => {
      config.get.mockImplementation(() => {
        throw new Error('Expected test error');
      });

      await sendNotification(requestMock, responseMock, nextMock);

      expect(nextMock).toHaveBeenCalledWith(new Error('Error sending notification: Expected test error'));
    });
  });

  describe('deleteNotification', () => {
    const { deleteNotification } = notificationsController;
    let requestMock;

    beforeEach(() => {
      requestMock = deleteNotificationRequest();
    });

    it('calls matched data to get the message information', async () => {
      await deleteNotification(requestMock, responseMock, nextMock);
      expect(matchedDataMock).toHaveBeenCalledWith(requestMock);
    });

    it('returns response configured with 404 status if there is no matching message to delete from mongo', async () => {
      notificationsRepository.deleteNotification.mockResolvedValueOnce({ n: 0 });

      const returnValue = await deleteNotification(requestMock, responseMock, nextMock);

      expect(returnValue).toBe(responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(404);
      expect(responseMock.send).toHaveBeenCalledWith(requestMock);
    });

    it('returns response configured with 200 status if message can be deleted from mongo', async () => {
      notificationsRepository.deleteNotification.mockResolvedValueOnce({ n: 1 });

      const returnValue = await deleteNotification(requestMock, responseMock, nextMock);

      expect(returnValue).toBe(responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(200);
      expect(responseMock.send).toHaveBeenCalledWith(requestMock);
    });

    it('calls next with an error if there is an error when deleting the message', async () => {
      notificationsRepository.deleteNotification.mockRejectedValueOnce(new Error('Expected test error'));

      await deleteNotification(requestMock, responseMock, nextMock);

      expect(nextMock).toHaveBeenCalledWith(new Error('Error deleting notification: Expected test error'));
    });
  });

  describe('getAllNotifications', () => {
    const { getAllNotifications } = notificationsController;

    it('calls to get all messages and returns response configured with 200 status and array of messages', async () => {
      const requestMock = {};
      const notifications = [notificationDocument()];
      notificationsRepository.getAll.mockResolvedValueOnce(notifications);

      const returnValue = await getAllNotifications(requestMock, responseMock, nextMock);

      // Assert
      expect(returnValue).toBe(responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(200);
      expect(responseMock.send).toHaveBeenCalledWith(notifications);
    });

    it('calls next with an error if there is an error when retrieving the messages', async () => {
      const requestMock = {};
      notificationsRepository.getAll.mockRejectedValueOnce(new Error('Expected test error'));

      await getAllNotifications(requestMock, responseMock, nextMock);

      expect(nextMock).toHaveBeenCalledWith(new Error('Error retrieving all notifications: Expected test error'));
    });
  });
});

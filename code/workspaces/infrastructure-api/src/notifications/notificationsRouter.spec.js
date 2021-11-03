import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import notificationsController from './notificationsController';
import notificationsRouter from './notificationsRouter';

jest.mock('./notificationsController');

describe('notificationsRouter', () => {
  let app;
  let permissions;

  beforeEach(() => {
    jest.clearAllMocks();

    app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    notificationsController.sendNotification.mockImplementation((_req, res) => {
      res.status(200).send();
    });
    notificationsController.deleteNotification.mockImplementation((_req, res) => {
      res.status(200).send();
    });
    notificationsController.getAllNotifications.mockImplementation((_req, res) => {
      res.status(200).send();
    });

    permissions = [];

    const authMockMiddleware = (req, res, next) => {
      req.user = {
        permissions,
      };
      next();
    };
    app.use(authMockMiddleware);
  });

  it('post to / sends a notification', async () => {
    const body = {
      title: 'title A',
      message: 'message B',
      userIDs: '123,456',
    };
    const res = await request(app.use(notificationsRouter)).post(
      '/',
    )
      .send(body)
      .set('Content-Type', 'application/json');

    expect(res.status).toEqual(200);

    expect(notificationsController.sendNotification).toHaveBeenCalled();
    expect(notificationsController.sendNotification.mock.calls[0][0].body).toEqual(body);
  });

  describe('delete to /:id ', () => {
    it('deletes a notification if authorised', async () => {
      permissions = ['system:instance:admin'];
      const res = await request(app.use(notificationsRouter)).delete('/1234');

      expect(res.status).toEqual(200);
      expect(notificationsController.deleteNotification).toHaveBeenCalled();
    });

    it('does not delete a notification if not authorised', async () => {
      permissions = [];
      const res = await request(app.use(notificationsRouter)).delete('/1234');

      expect(res.status).toEqual(401);
      expect(notificationsController.deleteNotification).not.toHaveBeenCalled();
    });
  });

  describe('get to /all ', () => {
    it('returns all notifications if authorised', async () => {
      permissions = ['system:instance:admin'];
      const res = await request(app.use(notificationsRouter)).get('/all');

      expect(res.status).toEqual(200);
      expect(notificationsController.getAllNotifications).toHaveBeenCalled();
    });

    it('does not return all notifications if not authorised', async () => {
      permissions = [];
      const res = await request(app.use(notificationsRouter)).get('/all');

      expect(res.status).toEqual(401);
      expect(notificationsController.getAllNotifications).not.toHaveBeenCalled();
    });
  });
});

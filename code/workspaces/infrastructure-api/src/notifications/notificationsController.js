import { matchedData } from 'express-validator';
import axios from 'axios';
import notificationsRepository from './notificationsRepository';
import emailNotificiationAdapter from './adapters/emailNotificationAdapter';
import config from '../config/config';

const adapters = [
  emailNotificiationAdapter,
];

async function sendNotification(request, response, next) {
  const { title, message, userIDs } = matchedData(request);

  try {
    const authUrl = config.get('authorisationService');
    // translate the userIDs to emails so we only store anonymous data but use emails when exiting the system
    const userEmails = await Promise.all(userIDs.split(',').map(async (id) => {
      const r = await axios.get(`${authUrl}/users/${id}`, { headers: { authorization: request.headers.authorization } });
      const userInfo = r.data;
      return userInfo.name;
    }));

    const notification = { title, message, userEmails };
    const dbNotification = { title, message, userIDs };
    const createdNotification = await notificationsRepository.createNotification(dbNotification);

    await Promise.all(adapters.map(async (a) => {
      await a.send(notification);
    }));

    return response.status(201).send(createdNotification);
  } catch (error) {
    return next(new Error(`Error sending notification: ${error.message}`));
  }
}

async function deleteNotification(request, response, next) {
  const { id } = matchedData(request);

  try {
    const result = await notificationsRepository.deleteNotification(id);
    if (result.n === 0) {
      return response.status(404).send({ id });
    }
    return response.status(200).send({ id });
  } catch (error) {
    return next(new Error(`Error deleting notification: ${error.message}`));
  }
}

async function getAllNotifications(_, response, next) {
  try {
    const notifications = await notificationsRepository.getAll();
    return response.status(200).send(notifications);
  } catch (error) {
    return next(new Error(`Error retrieving all notifications: ${error.message}`));
  }
}

export default {
  sendNotification,
  deleteNotification,
  getAllNotifications,
};

import database from '../config/database';
import notificationModel from './notification.model';

const NotificationModel = () => database.getModel(notificationModel.modelName);

async function createNotification(notification) {
  const [document] = await NotificationModel().create([notification], { setDefaultsOnInsert: true });
  return document;
}

async function deleteNotification(id) {
  const result = await NotificationModel()
    .deleteOne({ _id: id })
    .exec();
  return result;
}

async function getAll() {
  return NotificationModel().find().sort({ created: 'desc' }).exec();
}

export default {
  createNotification,
  deleteNotification,
  getAll,
};

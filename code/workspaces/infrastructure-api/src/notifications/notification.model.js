import mongoose from 'mongoose';

const { Schema } = mongoose;
const modelName = 'Notifications';

const NotificationSchema = new Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  userIDs: { type: String, required: true },
  created: { type: Date, default: Date.now },
});

mongoose.model(modelName, NotificationSchema, 'notifications');

export default { modelName };

import mongoose from 'mongoose';

const { Schema } = mongoose;

const DatalabSchema = new Schema({
  name: String,
  domain: String,
});

mongoose.model('Datalab', DatalabSchema, 'datalabs');

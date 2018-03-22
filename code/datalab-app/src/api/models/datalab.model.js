import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const DatalabSchema = new Schema({
  name: String,
  domain: String,
});

mongoose.model('Datalab', DatalabSchema, 'datalabs');

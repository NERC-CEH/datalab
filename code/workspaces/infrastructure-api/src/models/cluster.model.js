import { Schema, model } from 'mongoose';

const modelName = 'Cluster';
const DASK = 'DASK';
const possibleTypeValues = () => [DASK];

const ClusterSchema = new Schema({
  type: { type: String, enum: possibleTypeValues(), required: true },
  projectKey: { type: String, required: true },
  name: { type: String, required: true },
  volumeMount: String,
  condaPath: String,
  maxWorkers: { type: Number, required: true },
  maxWorkerMemoryGb: { type: Number, required: true },
  maxWorkerCpu: { type: Number, required: true },
});

model(modelName, ClusterSchema);

export default { modelName, possibleTypeValues, DASK };

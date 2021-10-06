import { Schema, model } from 'mongoose';
import { getEnumValues, status } from './stackEnums';

const modelName = 'Cluster';
const DASK = 'DASK';
const SPARK = 'SPARK';
const possibleTypeValues = () => [DASK, SPARK];

const ClusterSchema = new Schema({
  type: { type: String, enum: possibleTypeValues(), required: true },
  projectKey: { type: String, required: true },
  name: { type: String, required: true },
  displayName: { type: String, required: true },
  volumeMount: String,
  condaPath: String,
  maxWorkers: { type: Number, required: true },
  maxWorkerMemoryGb: { type: Number, required: true },
  maxWorkerCpu: { type: Number, required: true },
  schedulerAddress: String,
  assetIds: { type: [String], default: () => [] },
  status: { type: String, enum: getEnumValues(status), default: status.REQUESTED },
});

model(modelName, ClusterSchema);

export default { modelName, possibleTypeValues, DASK, SPARK };

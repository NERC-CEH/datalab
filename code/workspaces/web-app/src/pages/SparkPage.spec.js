import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import SparkPage, { getPythonMessage } from './SparkPage';

describe('SparkPage', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow();
  });

  it('renders correct snapshot', () => {
    expect(shallow(<SparkPage />)).toMatchSnapshot();
  });
});

describe('getMessage', () => {
  it('returns the correct message', () => {
    const condaPath = '/data/conda/myenv';
    const schedulerAddress = 'spark://spark-scheduler-mycluster:7077';

    expect(getPythonMessage(condaPath, schedulerAddress)).toMatchSnapshot();
  });
});

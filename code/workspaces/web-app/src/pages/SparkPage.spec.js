import React from 'react';
import { render } from '@testing-library/react';
import SparkPage, { getPythonMessage, getRMessage } from './SparkPage';

jest.mock('../containers/clusters/ClustersContainer', () => props => (<div>ClustersContainer mock {JSON.stringify(props)}</div>));

describe('SparkPage', () => {
  it('renders correct snapshot', () => {
    expect(render(<SparkPage />).container).toMatchSnapshot();
  });
});

describe('getPythonMessage', () => {
  it('returns the correct message', () => {
    const condaPath = '/data/conda/myenv';
    const schedulerAddress = 'spark://spark-scheduler-mycluster:7077';
    const maxMemory = 4;

    expect(getPythonMessage(condaPath, schedulerAddress, maxMemory)).toMatchSnapshot();
  });

  it('returns the correct message if memory is not an integer', () => {
    const condaPath = '/data/conda/myenv';
    const schedulerAddress = 'spark://spark-scheduler-mycluster:7077';
    const maxMemory = 5.5;

    expect(getPythonMessage(condaPath, schedulerAddress, maxMemory)).toMatchSnapshot();
  });
});

describe('getRMessage', () => {
  it('returns the correct message', () => {
    const schedulerAddress = 'spark://spark-scheduler-mycluster:7077';
    const maxMemory = 4;

    expect(getRMessage(schedulerAddress, maxMemory)).toMatchSnapshot();
  });

  it('returns the correct message if memory is not an integer', () => {
    const schedulerAddress = 'spark://spark-scheduler-mycluster:7077';
    const maxMemory = 5.5;

    expect(getRMessage(schedulerAddress, maxMemory)).toMatchSnapshot();
  });
});

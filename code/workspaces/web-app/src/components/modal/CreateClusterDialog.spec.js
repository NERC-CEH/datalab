import React from 'react';
import { shallow } from 'enzyme';
import CreateClusterDialog from './CreateClusterDialog';

describe('CreateClusterDialog', () => {
  const getProps = () => ({
    title: 'Create Cluster Dialog Title',
    formName: 'createCluster',
    onSubmit: jest.fn().mockName('onSubmit'),
    onCancel: jest.fn().mockName('onCancel'),
    dataStorageOptions: [],
    clusterMaxWorkers: { lowerLimit: 1, default: 4, upperLimit: 8 },
    workerMaxMemory: { lowerLimit: 0.5, default: 4, upperLimit: 8 },
    workerMaxCpu: { lowerLimit: 0.5, default: 0.5, upperLimit: 2 },
    projectKey: 'testproj',
  });

  it('renders correctly passing props to child components', () => {
    const props = getProps();
    const render = shallow(<CreateClusterDialog {...props} />);
    expect(render).toMatchSnapshot();
  });
});

import React from 'react';
import { render, fireEvent, screen, within } from '../../testUtils/renderTests';
import CreateClusterDialog from './CreateClusterDialog';

jest.mock('../cluster/CreateClusterForm', () => props => (<div>CreateClusterForm mock {JSON.stringify(props)}</div>));

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
    condaRequired: true,
  });

  it('renders correctly passing props to child components', () => {
    const props = getProps();
    render(<CreateClusterDialog {...props} />);
    expect(screen.getByRole('dialog')).toMatchSnapshot();
  });
});

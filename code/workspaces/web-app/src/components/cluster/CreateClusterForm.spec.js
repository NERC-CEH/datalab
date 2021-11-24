import React from 'react';
import { render } from '@testing-library/react';
import { PureCreateClusterForm, removeNoneOptions } from './CreateClusterForm';
import { useReduxFormValue } from '../../hooks/reduxFormHooks';

jest.mock('../../hooks/reduxFormHooks');
jest.mock('redux-form', () => ({
  Field: props => (<div>Field mock {JSON.stringify(props)}</div>),
}));

const getProps = () => ({
  handleSubmit: jest.fn().mockName('handleSubmit'),
  onSubmit: jest.fn().mockName('onSubmit'),
  cancel: jest.fn().mockName('cancel'),
  submitting: false,
  dataStorageOptions: [{ text: 'Test Store', value: 'teststore' }],
  clusterMaxWorkers: { lowerLimit: 1, default: 4, upperLimit: 8 },
  workerMaxMemory: { lowerLimit: 0.5, default: 4, upperLimit: 8 },
  workerMaxCpu: { lowerLimit: 0.5, default: 0.5, upperLimit: 2 },
  condaRequired: false,
});

describe('CreateClusterForm', () => {
  describe('it renders to match snapshot', () => {
    it('without condaPath field when volumeMount field has no value', () => {
      useReduxFormValue.mockReturnValueOnce(null);
      const props = getProps();
      const wrapper = render(<PureCreateClusterForm {...props} />).container;
      expect(wrapper).toMatchSnapshot();
    });

    it('without condaPath field when volumeMount field is set as None option', () => {
      useReduxFormValue.mockReturnValueOnce('--none--');
      const props = getProps();
      const wrapper = render(<PureCreateClusterForm {...props} />).container;
      expect(wrapper).toMatchSnapshot();
    });

    it('with condaPath field when volumeMount field is set', () => {
      useReduxFormValue.mockReturnValueOnce('teststore');
      const props = getProps();
      const wrapper = render(<PureCreateClusterForm {...props} />).container;
      expect(wrapper).toMatchSnapshot();
    });

    it('when conda is required and volumeMount field is set', () => {
      useReduxFormValue.mockReturnValueOnce('teststore');
      const props = {
        ...getProps(),
        condaRequired: true,
      };
      const wrapper = render(<PureCreateClusterForm {...props} />).container;
      expect(wrapper).toMatchSnapshot();
    });
  });
});

describe('removeNoneOptions', () => {
  it('removes all items in provided values object that contain the none option value', () => {
    const noneValue = '--none--';
    const values = {
      name: 'testcluster',
      displayName: 'Test Cluster',
      volumeMount: noneValue,
      maxWorkers: 4,
    };
    const result = removeNoneOptions(values);
    expect(result.name).toEqual(values.name);
    expect(result.displayName).toEqual(values.displayName);
    expect(result.maxWorkers).toEqual(values.maxWorkers);
    expect(result.volumeMount).toBeUndefined();
  });
});

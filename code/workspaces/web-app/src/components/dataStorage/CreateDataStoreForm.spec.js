import React from 'react';
import { shallow } from 'enzyme';
import { PureCreateDataStoreForm } from './CreateDataStoreForm';
import { storageCreationAllowedDisplayOptions } from '../../config/storage';

jest.mock('../../config/storage');
storageCreationAllowedDisplayOptions.mockReturnValue({
  NFS: {
    text: 'NFS',
    value: 'NFS',
  },
});

describe('CreateDataStoreForm', () => {
  function shallowRender(props) {
    return shallow(<PureCreateDataStoreForm {...props} />);
  }

  const onSubmitMock = jest.fn();
  const onCancelMock = jest.fn();

  const generateProps = () => ({
    onSubmit: onSubmitMock,
    cancel: onCancelMock,
    projectKey: 'test-proj',
  });

  it('creates correct snapshot for create Data Store Form', () => {
    // Arrange
    const props = generateProps();

    // Act
    const output = shallowRender(props);

    // Assert
    expect(output).toMatchSnapshot();
  });
});

import React from 'react';
import { render } from '../../testUtils/renderTests';
import { PureCreateDataStoreForm } from './CreateDataStoreForm';
import { storageCreationAllowedDisplayOptions } from '../../config/storage';

jest.mock('../../config/storage');
jest.mock('redux-form', () => ({
  ...jest.requireActual('redux-form'),
  Field: props => (<div>Field mock {JSON.stringify(props)}</div>),
}));

describe('CreateDataStoreForm', () => {
  function shallowRender(props) {
    return render(<PureCreateDataStoreForm {...props} />).container;
  }

  const onSubmitMock = jest.fn();
  const onCancelMock = jest.fn();

  const generateProps = () => ({
    onSubmit: onSubmitMock,
    cancel: onCancelMock,
    projectKey: 'test-proj',
  });

  beforeEach(() => {
    storageCreationAllowedDisplayOptions.mockReturnValue({
      NFS: {
        text: 'NFS',
        value: 'NFS',
      },
    });
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

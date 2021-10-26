import React from 'react';
import { shallow } from 'enzyme';
import CreateDataStoreDialog from './CreateDataStoreDialog';
import { storageCreationDefaultType } from '../../config/storage';

jest.mock('../../config/storage');

describe('CreateDataStoreDialog dialog', () => {
  function shallowRender(props) {
    return shallow(<CreateDataStoreDialog {...props} />);
  }

  const onSubmitMock = jest.fn();
  const onCancelMock = jest.fn();

  const generateProps = () => ({
    title: 'Title',
    notebook: { displayName: 'Name' },
    onSubmit: onSubmitMock,
    onCancel: onCancelMock,
    projectKey: 'test-proj',
  });

  beforeEach(() => {
    storageCreationDefaultType.mockReturnValue('NFS');
  });

  it('creates correct snapshot', () => {
    // Arrange
    const props = generateProps();

    // Act
    const output = shallowRender(props);

    // Assert
    expect(output).toMatchSnapshot();
  });

  it('wires up cancel function correctly', () => {
    // Arrange
    const props = generateProps();

    // Act
    const output = shallowRender(props);
    const cancelFunction = output.find('ReduxForm').prop('cancel');
    cancelFunction();

    // Assert
    expect(onCancelMock).toHaveBeenCalled();
  });

  it('wires up submit function correctly', () => {
    // Arrange
    const props = generateProps();

    // Act
    const output = shallowRender(props);
    const submitFunction = output.find('ReduxForm').prop('onSubmit');
    submitFunction();

    // Assert
    expect(onSubmitMock).toHaveBeenCalled();
  });
});

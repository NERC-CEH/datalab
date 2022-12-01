import React from 'react';
import { render, screen } from '../../testUtils/renderTests';
import CreateDataStoreDialog from './CreateDataStoreDialog';
import { storageCreationDefaultType } from '../../config/storage';

jest.mock('../../config/storage');
jest.mock('../dataStorage/CreateDataStoreForm', () => props => (<div>CreateDataStoreForm mock {JSON.stringify(props)}</div>));
jest.mock('../dataStorage/PreviewDataStoreCard', () => () => (<div>PreviewDataStoreCard mock</div>));

describe('CreateDataStoreDialog dialog', () => {
  function shallowRender(props) {
    render(<CreateDataStoreDialog {...props} />);
    return screen.getByRole('dialog');
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
});

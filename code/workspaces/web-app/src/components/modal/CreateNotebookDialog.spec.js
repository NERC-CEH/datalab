import React from 'react';
import { render, screen } from '../../testUtils/renderTests';
import CreateNotebookDialog from './CreateNotebookDialog';
import { getNotebookInfo } from '../../config/images';

jest.mock('../../hooks/reduxFormHooks');
jest.mock('../../config/images');
jest.mock('../notebooks/CreateNotebookForm', () => props => (<div>
    CreateNotebookForm mock
    {JSON.stringify(props)}
    {`onSubmit result: ${props.onSubmit()}`}
    {`onCancel result: ${props.cancel()}`}
  </div>));

describe('Notebook dialog', () => {
  beforeEach(() => {
    getNotebookInfo.mockReturnValue({
      jupyterLab: {
        displayName: 'JupyterLab',
      },
    });
  });

  const onSubmitMock = jest.fn();
  const onCancelMock = jest.fn();

  const generateProps = () => ({
    title: 'Title',
    onSubmit: onSubmitMock,
    onCancel: onCancelMock,
    dataStorageOptions: [
      { value: 'value' },
      { value: 'another value' },
    ],
  });

  it('creates correct snapshot', () => {
    // Arrange
    const props = generateProps();
    props.onSubmit.mockReturnValue('submit called');
    props.onCancel.mockReturnValue('onCancel called');

    render(<CreateNotebookDialog {...props} />);

    // Assert
    expect(screen.getByText('Title').parentElement.parentElement).toMatchSnapshot();
  });

  it('wires up cancel function correctly', () => {
    const props = generateProps();
    props.onSubmit.mockReturnValue('submit called');
    props.onCancel.mockReturnValue('onCancel called');

    render(<CreateNotebookDialog {...props} />);

    expect(screen.getByText('onCancel result: onCancel called', { exact: false })).not.toBeNull();
  });

  it('wires up submit function correctly', () => {
    const props = generateProps();
    props.onSubmit.mockReturnValue('submit called');
    props.onCancel.mockReturnValue('onCancel called');

    render(<CreateNotebookDialog {...props} />);

    expect(screen.getByText('onSubmit result: submit called', { exact: false })).not.toBeNull();
  });
});

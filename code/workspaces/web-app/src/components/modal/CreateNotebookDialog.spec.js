import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import CreateNotebookDialog from './CreateNotebookDialog';
import { getNotebookInfo } from '../../config/images';

jest.mock('../../hooks/reduxFormHooks');
jest.mock('../../config/images');

describe('Notebook dialog', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ dive: true });

    getNotebookInfo.mockReturnValue({
      jupyterLab: {
        displayName: 'JupyterLab',
      },
    });
  });

  function shallowRender(props) {
    return shallow(<CreateNotebookDialog {...props} />);
  }

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

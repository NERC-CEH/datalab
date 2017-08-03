import React from 'react';
import { shallow } from 'enzyme';
import NotebookButton from './NotebookButton';

describe('NotebookButton', () => {
  function shallowRender(props) {
    return shallow(<NotebookButton {...props} />);
  }

  const notebook = {
    name: 'expectedName',
    url: 'notebookurl',
    token: 'expectedToken',
  };
  it('renders correct snapshot', () => {
    // Arrange
    const noop = () => {};

    // Act
    const renderedComponent = shallowRender({ notebook, openNotebookAction: noop });

    // Assert
    expect(renderedComponent).toMatchSnapshot();
  });

  it('onClick calls openNotebookAction with correct props', () => {
    // Arrange
    const openNotebookMock = jest.fn();

    // Act
    const renderedComponent = shallowRender({ notebook, openNotebookAction: openNotebookMock });
    const onClick = renderedComponent.prop('onClick');

    expect(openNotebookMock).not.toHaveBeenCalled();
    onClick();
    expect(openNotebookMock).toHaveBeenCalledTimes(1);
    expect(openNotebookMock).toHaveBeenCalledWith('notebookurl', 'expectedToken');
  });
});

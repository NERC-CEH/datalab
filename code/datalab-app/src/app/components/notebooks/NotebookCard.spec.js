import React from 'react';
import { shallow } from 'enzyme';
import NotebookCard from './NotebookCard';

describe('NotebookCard', () => {
  function shallowRender(props) {
    return shallow(<NotebookCard {...props} />);
  }

  const openNotebookMock = jest.fn();

  const generateProps = type => ({
    notebook: {
      id: 100,
      displayName: 'name1',
      type,
    },
    openNotebook: openNotebookMock,
  });

  beforeEach(() => jest.resetAllMocks());

  it('creates correct snapshot for Jupyer notebook type', () => {
    // Arrange
    const props = generateProps('jupyter');

    // Act
    const output = shallowRender(props);

    // Assert
    expect(output).toMatchSnapshot();
  });

  it('creates correct snapshot for Zeppelin notebook type', () => {
    // Arrange
    const props = generateProps('zeppelin');

    // Act
    const output = shallowRender(props);

    // Assert
    expect(output).toMatchSnapshot();
  });

  it('onCLick function calls openNotebook with correct props', () => {
    // Arrange
    const props = generateProps('jupyter');

    // Act
    const output = shallowRender(props);
    const onClick = output.find('Button').prop('onClick');

    // Assert
    expect(openNotebookMock).not.toHaveBeenCalled();
    onClick();
    expect(openNotebookMock).toHaveBeenCalledTimes(1);
    expect(openNotebookMock).toHaveBeenCalledWith(100);
  });
});

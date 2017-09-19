import React from 'react';
import { shallow } from 'enzyme';
import NewNotebookButton from './NewNotebookButton';

describe('New Notebook Button', () => {
  function shallowRender(props) {
    return shallow(<NewNotebookButton {...props} />);
  }

  const generateProps = () => ({
    onClick: () => {},
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

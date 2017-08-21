import React from 'react';
import { shallow } from 'enzyme';
import NotebookCards from './NotebookCards';

describe('NotebookCards', () => {
  function shallowRender(props) {
    return shallow(<NotebookCards {...props} />);
  }

  const generateProps = () => ({
    notebooks: [
      { displayName: 'name1', id: '1', type: 'type1' },
      { displayName: 'name2', id: '2', type: 'type2' },
      { displayName: 'name3', id: '3', type: 'type3' },
    ],
    openNotebook: () => {},
  });

  it('creates correct snapshot for an array of notebooks', () => {
    // Arrange
    const props = generateProps();

    // Act
    const output = shallowRender(props);

    // Assert
    expect(output).toMatchSnapshot();
  });

  it('creates correct snapshot for an empty array', () => {
    // Arrange
    const props = { ...generateProps(), notebooks: [] };

    // Act
    const output = shallowRender(props);

    // Assert
    expect(output).toMatchSnapshot();
  });
});

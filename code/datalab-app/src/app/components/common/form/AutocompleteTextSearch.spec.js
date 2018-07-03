import React from 'react';
import { createShallow } from 'material-ui/test-utils';
import AutocompleteTextSearch from './AutocompleteTextSearch';

describe('AutocompleteTextSearch', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow();
  });

  function shallowRender(props) {
    return shallow(<AutocompleteTextSearch {...props} />);
  }

  it('generates correct snapshot', () => {
    // Arrange
    const suggestions = [
      { label: 'expectedLabelOne', value: 'expectedValueOne' },
      { label: 'expectedLabelTwo', value: 'expectedValueTwo' },
    ];
    const selectedItems = [
      { label: 'expectedLabelTwo', value: 'expectedValueTwo' },
    ];

    // Act
    const output = shallowRender({
      suggestions,
      selectedItems,
      addItem: () => {},
      removeItem: () => {},
      placeholder: 'Expected placerholder text',
    });

    // Assert
    expect(output).toMatchSnapshot();
  });
});

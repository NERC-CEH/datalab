import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AutocompleteTextSearch from './AutocompleteTextSearch';

jest.mock('@mui/material/Chip', () => props => (<div>Chip mock {JSON.stringify(props)}</div>));

describe('AutocompleteTextSearch', () => {
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
    const props = {
      suggestions,
      selectedItems,
      addItem: () => {},
      removeItem: () => {},
      placeholder: 'Expected placerholder text',
    };
    const wrapper = render(<AutocompleteTextSearch {...props} />);
    fireEvent.change(wrapper.getByPlaceholderText('Expected placerholder text'), { target: { value: 'exp' } });
    expect(wrapper.container).toMatchSnapshot();
  });
});

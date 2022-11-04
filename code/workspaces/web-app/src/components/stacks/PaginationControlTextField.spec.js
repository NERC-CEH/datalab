import React from 'react';
import { render, fireEvent } from '../../testUtils/renderTests';
import PaginationControlTextField from './PaginationControlTextField';

describe('PaginationControlTextField', () => {
  function renderComponent(props) {
    return render(<PaginationControlTextField {...props} />);
  }

  function generateProps({
    pageInputValue = 1,
    setPageInputValue = () => {},
    changePageToUserInput = () => {},
  }) {
    return { pageInputValue, setPageInputValue, changePageToUserInput };
  }

  it('renders with the provided pageInputValue as the value', () => {
    const props = generateProps({ pageInputValue: 5 });
    const wrapper = renderComponent(props);
    expect(wrapper.container).toMatchSnapshot();
  });

  it('calls setPageInputValue with the new value when the input changes', () => {
    const setPageInputValueMock = jest.fn();
    const props = generateProps({ setPageInputValue: setPageInputValueMock });
    const wrapper = renderComponent(props);

    const valueChangedTo = 5;
    fireEvent.change(wrapper.getByRole('textbox'), { target: { value: valueChangedTo } });

    expect(setPageInputValueMock.mock.calls.length).toBe(1);
    expect(setPageInputValueMock.mock.calls[0][0]).toBe('5');
  });

  it('calls changePageToUserInput when blurred', () => {
    const changePageToUserInputMock = jest.fn();
    const props = generateProps({ changePageToUserInput: changePageToUserInputMock });
    const wrapper = renderComponent(props);

    fireEvent.blur(wrapper.getByRole('textbox'));

    expect(changePageToUserInputMock.mock.calls.length).toBe(1);
  });

  it('calls changePageToUserInput when Enter key is pressed', () => {
    const changePageToUserInputMock = jest.fn();
    const props = generateProps({ changePageToUserInput: changePageToUserInputMock });
    const wrapper = renderComponent(props);

    fireEvent.keyPress(wrapper.getByRole('textbox'), { key: 'Enter', code: 13, charCode: 13 });

    expect(changePageToUserInputMock.mock.calls.length).toBe(1);
  });
});

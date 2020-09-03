import React from 'react';
import { shallow } from 'enzyme';
import PaginationControlTextField from './PaginationControlTextField';

describe('PaginationControlTextField', () => {
  function shallowRender(props) {
    return shallow(<PaginationControlTextField {...props} />);
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
    const render = shallowRender(props);
    expect(render).toMatchSnapshot();
  });

  it('calls setPageInputValue with the new value when the input changes', () => {
    const setPageInputValueMock = jest.fn();
    const props = generateProps({ setPageInputValue: setPageInputValueMock });
    const render = shallowRender(props);

    const valueChangedTo = 5;
    render.simulate('change', { target: { value: valueChangedTo } });

    expect(setPageInputValueMock.mock.calls.length).toBe(1);
    expect(setPageInputValueMock.mock.calls[0][0]).toBe(5);
  });

  it('calls changePageToUserInput when blurred', () => {
    const changePageToUserInputMock = jest.fn();
    const props = generateProps({ changePageToUserInput: changePageToUserInputMock });
    const render = shallowRender(props);

    render.simulate('blur');

    expect(changePageToUserInputMock.mock.calls.length).toBe(1);
  });

  it('calls changePageToUserInput when Enter key is pressed', () => {
    const changePageToUserInputMock = jest.fn();
    const props = generateProps({ changePageToUserInput: changePageToUserInputMock });
    const render = shallowRender(props);

    render.simulate('keyPress', { key: 'Enter' });

    expect(changePageToUserInputMock.mock.calls.length).toBe(1);
  });
});

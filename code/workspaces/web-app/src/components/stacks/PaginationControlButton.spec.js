import React from 'react';
import { shallow } from 'enzyme';
import PaginationControlButton, { PREVIOUS_PAGE, NEXT_PAGE } from './PaginationControlButton';

describe('PaginationControlButton', () => {
  function shallowRender(props) {
    return shallow(<PaginationControlButton {...props} />);
  }

  function generateProps({
    variant = PREVIOUS_PAGE,
    onClick = jest.fn().mockName('onClick'),
    disabled = false,
  }) {
    return { variant, onClick, disabled };
  }

  it(`renders correctly when variant is "${PREVIOUS_PAGE}" and it is not disabled`, () => {
    const props = generateProps({ variant: PREVIOUS_PAGE });
    const render = shallowRender(props);
    expect(render).toMatchSnapshot();
  });

  it(`renders correctly when variant is "${PREVIOUS_PAGE}" and it is disabled`, () => {
    const props = generateProps({ variant: PREVIOUS_PAGE, disabled: true });
    const render = shallowRender(props);
    expect(render).toMatchSnapshot();
  });

  it(`renders correctly when variant is "${NEXT_PAGE}" and it is not disabled`, () => {
    const props = generateProps({ variant: NEXT_PAGE });
    const render = shallowRender(props);
    expect(render).toMatchSnapshot();
  });

  it(`renders correctly when variant is "${NEXT_PAGE}" and it is disabled`, () => {
    const props = generateProps({ variant: NEXT_PAGE, disabled: true });
    const render = shallowRender(props);
    expect(render).toMatchSnapshot();
  });
});

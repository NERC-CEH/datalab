import React from 'react';
import { render } from '../../testUtils/renderTests';
import PaginationControlButton, { PREVIOUS_PAGE, NEXT_PAGE } from './PaginationControlButton';

jest.mock('@mui/icons-material/NavigateBeforeRounded', () => () => (<>NavigateBeforeRoundedIcon Mock</>));
jest.mock('@mui/icons-material/NavigateNextRounded', () => () => (<>NavigateNextRoundedIcon Mock</>));

describe('PaginationControlButton', () => {
  function renderComponent(props) {
    return render(<PaginationControlButton {...props} />);
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
    const wrapper = renderComponent(props);
    expect(wrapper.container).toMatchSnapshot();
  });

  it(`renders correctly when variant is "${PREVIOUS_PAGE}" and it is disabled`, () => {
    const props = generateProps({ variant: PREVIOUS_PAGE, disabled: true });
    const wrapper = renderComponent(props);
    expect(wrapper.container).toMatchSnapshot();
  });

  it(`renders correctly when variant is "${NEXT_PAGE}" and it is not disabled`, () => {
    const props = generateProps({ variant: NEXT_PAGE });
    const wrapper = renderComponent(props);
    expect(wrapper.container).toMatchSnapshot();
  });

  it(`renders correctly when variant is "${NEXT_PAGE}" and it is disabled`, () => {
    const props = generateProps({ variant: NEXT_PAGE, disabled: true });
    const wrapper = renderComponent(props);
    expect(wrapper.container).toMatchSnapshot();
  });
});

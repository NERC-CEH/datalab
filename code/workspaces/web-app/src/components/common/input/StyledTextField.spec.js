import React from 'react';
import { render } from '../../../testUtils/renderTests';
import StyledTextField from './StyledTextField';

jest.mock('@mui/material/TextField', () => props => (<div>TextField mock {JSON.stringify(props)}</div>));

const shallowRender = props => render(<StyledTextField {...props} />).container;
const expectShallowRenderToMatchSnapshot = props => expect(shallowRender(props)).toMatchSnapshot();

describe('StyledTextField', () => {
  it('renders to match snapshot when no extra props are provided', () => {
    expectShallowRenderToMatchSnapshot({});
  });

  it('renders to match snapshot forwarding passed props to child component', () => {
    expectShallowRenderToMatchSnapshot({ className: 'class-name', otherProp: 'value' });
  });

  it('renders to match snapshot overriding default prop value if provide different value', () => {
    expectShallowRenderToMatchSnapshot({ margin: 'normal' });
  });

  it('renders components passed as children', () => {
    const wrapper = render(
      <StyledTextField>
        <span>Child Content</span>
      </StyledTextField>,
    ).container;
    expect(wrapper).toMatchSnapshot();
  });
});

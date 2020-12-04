import React from 'react';
import { shallow } from 'enzyme';
import StyledTextField from './StyledTextField';

const shallowRender = props => shallow(<StyledTextField {...props} />);
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
    const wrapper = shallow(
      <StyledTextField>
        <span>Child Content</span>
      </StyledTextField>,
    );
    expect(wrapper).toMatchSnapshot();
  });
});

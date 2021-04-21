import React from 'react';
import { shallow } from 'enzyme';
import PrimaryActionButton from './PrimaryActionButton';

function shallowRender(props) {
  return shallow(<PrimaryActionButton {...props} />);
}

describe('PrimaryActionButton', () => {
  it('overrides variant and color props', () => {
    expect(shallowRender({ variant: 'contained', color: 'secondary' })).toMatchSnapshot();
  });
});

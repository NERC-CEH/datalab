import React from 'react';
import { shallow } from 'enzyme';
import NavBar from './NavBar';

describe('NavBar', () => {
  it('renders correct snapshot', () => {
    expect(shallow(<NavBar/>)).toMatchSnapshot();
  });
});

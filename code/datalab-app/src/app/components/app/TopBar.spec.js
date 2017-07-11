import React from 'react';
import { shallow } from 'enzyme';
import TopBar from './TopBar';

describe('Topbar', () => {
  function shallowRender(props) {
    return shallow(<TopBar {...props} />);
  }

  it('correctly renders correct snapshot', () => {
    expect(shallowRender()).toMatchSnapshot();
  });

  it('style is passed to child segment', () => {
    expect(shallowRender({ topBarStyle: { element: 'expectedTopBarStyle' } }).find('Segment').prop('style')).toEqual({ element: 'expectedTopBarStyle' });
  });
});

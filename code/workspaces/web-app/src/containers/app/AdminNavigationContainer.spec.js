import React from 'react';
import { shallow } from 'enzyme';
import AdminNavigationContainer from './AdminNavigationContainer';

describe('AdminNavigationContainer', () => {
  const shallowRender = () => {
    const promisedUserPermissions = {
      fetching: false,
      error: null,
      value: ['some-permission'],
    };
    const props = {
      promisedUserPermissions,
    };

    return shallow(<AdminNavigationContainer {...props} />);
  };

  it('renders to match snapshot passing correct props to children', () => {
    expect(shallowRender()).toMatchSnapshot();
  });
});

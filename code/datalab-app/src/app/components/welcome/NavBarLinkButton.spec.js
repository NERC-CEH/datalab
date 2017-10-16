import React from 'react';
import { createShallow } from 'material-ui/test-utils';
import NavBarLinkButton from './NavBarLinkButton';

describe('NavBarLinkButton', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  it('renders correct snapshot', () => {
    expect(shallow(<NavBarLinkButton>{'expectedChildren'}</NavBarLinkButton>)).toMatchSnapshot();
  });
});

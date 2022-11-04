import React from 'react';
import { render } from '../../testUtils/renderTests';
import NavBarLinkButton from './NavBarLinkButton';

describe('NavBarLinkButton', () => {
  it('renders correct snapshot', () => {
    expect(render(<NavBarLinkButton>{'expectedChildren'}</NavBarLinkButton>).container).toMatchSnapshot();
  });
});

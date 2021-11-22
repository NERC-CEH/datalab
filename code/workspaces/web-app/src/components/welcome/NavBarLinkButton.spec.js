import React from 'react';
import { render } from '@testing-library/react';
import NavBarLinkButton from './NavBarLinkButton';

describe('NavBarLinkButton', () => {
  it('renders correct snapshot', () => {
    expect(render(<NavBarLinkButton>{'expectedChildren'}</NavBarLinkButton>).container).toMatchSnapshot();
  });
});

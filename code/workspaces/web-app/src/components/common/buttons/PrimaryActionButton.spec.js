import React from 'react';
import { render } from '../../../testUtils/renderTests';
import PrimaryActionButton from './PrimaryActionButton';

describe('PrimaryActionButton', () => {
  it('overrides variant and color props', () => {
    const props = { variant: 'contained', color: 'secondary' };
    expect(render(<PrimaryActionButton {...props}><div>Test Child</div></PrimaryActionButton>).container).toMatchSnapshot();
  });
});

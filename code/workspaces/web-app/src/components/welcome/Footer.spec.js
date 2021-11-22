import React from 'react';
import { render } from '@testing-library/react';
import Footer from './Footer';
import { getVersion } from '../../config/version';

jest.mock('../../config/version');

describe('Footer', () => {
  it('renders correct snapshot', () => {
    getVersion.mockReturnValue('jest test 1.23456');
    expect(render(<Footer />).container).toMatchSnapshot();
  });
});

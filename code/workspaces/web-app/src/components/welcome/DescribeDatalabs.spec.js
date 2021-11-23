import React from 'react';
import { render } from '@testing-library/react';
import DescribeDatalabs from './DescribeDatalabs';

jest.mock('./DescribeElement', () => props => (<div>DescribeElement mock {JSON.stringify(props)}</div>));

describe('DescribeDatalabs', () => {
  it('renders correct snapshot', () => {
    expect(render(<DescribeDatalabs/>).container).toMatchSnapshot();
  });
});

import React from 'react';
import { render } from '../../testUtils/renderTests';
import DescribeDatalabs from './DescribeDatalabs';

jest.mock('./DescribeElement', () => props => (<div>DescribeElement mock {JSON.stringify(props)}</div>));

describe('DescribeDatalabs', () => {
  it('renders correct snapshot', () => {
    expect(render(<DescribeDatalabs/>).container).toMatchSnapshot();
  });
});

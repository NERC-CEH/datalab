import React from 'react';
import { render } from '@testing-library/react';
import Sites from './Sites';

jest.mock('./ResourceStackCards', () => props => (<>ResourceStackCards Mock {JSON.stringify(props)}</>));

describe('Sites', () => {
  const sites = [{
    key: 'test-key',
    name: 'Test Name',
  }];
  const props = {
    sites,
  };

  it('renders to match snapshot passing correct props to children', () => {
    expect(render(<Sites {...props} />).container).toMatchSnapshot();
  });
});

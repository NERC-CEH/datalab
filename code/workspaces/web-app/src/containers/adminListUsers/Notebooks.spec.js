import React from 'react';
import { render } from '@testing-library/react';
import Notebooks from './Notebooks';

jest.mock('./ResourceStackCards', () => props => (<>ResourceStackCards Mock {JSON.stringify(props)}</>));

describe('Notebooks', () => {
  const notebooks = [{
    key: 'test-key',
    name: 'Test Name',
  }];
  const props = {
    notebooks,
  };

  it('renders to match snapshot passing correct props to children', () => {
    expect(render(<Notebooks {...props} />).container).toMatchSnapshot();
  });
});

import React from 'react';
import { render } from '@testing-library/react';
import DataStores from './DataStores';

jest.mock('./ResourceStackCards', () => props => (<>ResourceStackCards Mock {JSON.stringify(props)}</>));

describe('DataStores', () => {
  const dataStores = [{
    key: 'test-key',
    name: 'Test Name',
  }];
  const props = {
    dataStores,
  };

  it('renders to match snapshot passing correct props to children', () => {
    expect(render(<DataStores {...props} />).container).toMatchSnapshot();
  });
});

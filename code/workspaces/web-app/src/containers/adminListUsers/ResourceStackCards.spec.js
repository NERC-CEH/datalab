import React from 'react';
import { render } from '../../testUtils/renderTests';
import ResourceStackCards from './ResourceStackCards';

jest.mock('../../components/stacks/StackCards', () => props => (<>StackCards Mock {JSON.stringify(props, null, 2)}</>));

describe('ResourceStackCards', () => {
  const resources = [{
    key: 'test-key',
    name: 'Test Name',
  }];
  const typeName = 'some resource';
  const typeNamePlural = 'some resources';
  const props = {
    resources, typeName, typeNamePlural,
  };

  it('renders to match snapshot passing correct props to children', () => {
    expect(render(<ResourceStackCards {...props} />).container).toMatchSnapshot();
  });
});

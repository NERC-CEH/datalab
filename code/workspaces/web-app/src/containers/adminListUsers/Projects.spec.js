import React from 'react';
import { render } from '@testing-library/react';
import { PureProjects as Projects } from './Projects';

jest.mock('../../components/stacks/StackCards', () => props => (<>StackCards Mock {JSON.stringify(props, null, 2)}</>));

describe('Projects', () => {
  const projects = [{
    id: 'test-id',
    key: 'test-key',
    name: 'Test Name',
    description: 'test description',
    accessible: 'test accessible',
  }];
  const props = {
    projects,
  };

  it('renders to match snapshot passing correct props to children', () => {
    expect(render(<Projects {...props} />).container).toMatchSnapshot();
  });
});

import React from 'react';
import { render } from '../testUtils/renderTests';
import ProjectsPage from './ProjectsPage';

jest.mock('../containers/projects/ProjectsContainer', () => props => (<div>ProjectsContainer mock {JSON.stringify(props)}</div>));
jest.mock('../components/app/Footer', () => () => (<div>Footer mock</div>));

it('ProjectsPage renders correct snapshot', () => {
  expect(render(<ProjectsPage userPermissions={['expectedPermission']} />).container).toMatchSnapshot();
});

import React from 'react';
import { render } from '../testUtils/renderTests';
import ProjectInfoPage from './ProjectInfoPage';

const userPermissions = ['expectedPermission'];

jest.mock('../containers/projectInfo/ProjectInfoContainer', () => () => (<div>ProjectInfoContainer mock</div>));
jest.mock('../components/app/Footer', () => () => (<div>Footer mock</div>));

it('ProjectInfoPage renders correct snapshot', () => {
  expect(render(<ProjectInfoPage userPermissions={userPermissions} />).container).toMatchSnapshot();
});

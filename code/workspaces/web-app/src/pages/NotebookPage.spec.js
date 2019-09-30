import React from 'react';
import { shallow } from 'enzyme';
import NotebooksPage from './NotebooksPage';

const match = { params: { projectKey: 'project' } };

it('NotebooksPage renders correct snapshot', () => {
  expect(shallow(<NotebooksPage userPermissions={['expectedPermission']} match={match} />)).toMatchSnapshot();
});

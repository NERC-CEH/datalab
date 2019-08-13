import React from 'react';
import { shallow } from 'enzyme';
import NotebooksPage from './NotebooksPage';

it('NotebooksPage renders correct snapshot', () => {
  expect(shallow(<NotebooksPage userPermissions={['expectedPermission']} />)).toMatchSnapshot();
});

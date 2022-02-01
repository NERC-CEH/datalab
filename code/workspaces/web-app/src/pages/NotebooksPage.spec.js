import React from 'react';
import { render } from '../testUtils/renderTests';
import NotebooksPage from './NotebooksPage';

jest.mock('../containers/notebooks/NotebooksContainer', () => props => (<div>NotebooksContainer mock {JSON.stringify(props)}</div>));
jest.mock('../components/app/Footer', () => () => (<div>Footer mock</div>));

it('NotebooksPage renders correct snapshot', () => {
  expect(render(<NotebooksPage userPermissions={['expectedPermission']} />).container).toMatchSnapshot();
});

import React from 'react';
import { render } from '../testUtils/renderTests';
import PublishingPage from './PublishingPage';

jest.mock('../containers/sites/SitesContainer', () => props => (<div>SitesContainer mock {JSON.stringify(props)}</div>));
jest.mock('../components/app/Footer', () => () => (<div>Footer mock</div>));

it('PublishingPage renders correct snapshot', () => {
  expect(render(<PublishingPage userPermissions={['expectedPermission']} />).container).toMatchSnapshot();
});

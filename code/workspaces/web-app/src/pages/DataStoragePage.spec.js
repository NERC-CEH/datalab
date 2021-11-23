import React from 'react';
import { render } from '@testing-library/react';
import DataStoragePage from './DataStoragePage';

const userPermissions = ['expectedPermission'];

jest.mock('../containers/dataStorage/DataStorageContainer', () => props => (<div>DataStorageContainer mock {JSON.stringify(props)}</div>));
jest.mock('../components/app/Footer', () => () => (<div>Footer mock</div>));

it('DataStoragePage renders correct snapshot', () => {
  expect(render(<DataStoragePage userPermissions={userPermissions} />).container).toMatchSnapshot();
});

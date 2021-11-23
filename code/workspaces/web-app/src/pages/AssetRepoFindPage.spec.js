import React from 'react';
import { render } from '@testing-library/react';
import AssetRepoFindPage from './AssetRepoFindPage';

const userPermissions = ['expectedPermission'];

jest.mock('../containers/assetRepo/AssetRepoFindContainer', () => props => (<div>AssetRepoFindContainer mock {JSON.stringify(props)}</div>));
jest.mock('../components/app/Footer', () => () => (<div>Footer mock</div>));

it('AssetRepoFindPage renders correct snapshot', () => {
  expect(render(<AssetRepoFindPage userPermissions={userPermissions}/>).container).toMatchSnapshot();
});

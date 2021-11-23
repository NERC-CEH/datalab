import React from 'react';
import { render } from '@testing-library/react';
import AssetRepoAddMetadataPage from './AssetRepoAddMetadataPage';

jest.mock('../components/assetRepo/AddRepoMetadataDetails', () => () => (<div>AddRepoMetadataDetails mock</div>));
jest.mock('../components/app/Footer', () => () => (<div>Footer mock</div>));

it('AssetRepoAddMetadataPage renders correct snapshot', () => {
  expect(render(<AssetRepoAddMetadataPage/>).container).toMatchSnapshot();
});

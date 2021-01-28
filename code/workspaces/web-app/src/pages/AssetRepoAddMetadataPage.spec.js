import React from 'react';
import { shallow } from 'enzyme';
import AssetRepoAddMetadataPage from './AssetRepoAddMetadataPage';

it('AssetRepoAddMetadataPage renders correct snapshot', () => {
  expect(shallow(<AssetRepoAddMetadataPage/>)).toMatchSnapshot();
});

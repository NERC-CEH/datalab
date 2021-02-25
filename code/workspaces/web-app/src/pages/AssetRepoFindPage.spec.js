import React from 'react';
import { shallow } from 'enzyme';
import AssetRepoFindPage from './AssetRepoFindPage';

it('AssetRepoFindPage renders correct snapshot', () => {
  expect(shallow(<AssetRepoFindPage/>)).toMatchSnapshot();
});

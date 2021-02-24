import React from 'react';
import { shallow } from 'enzyme';
import AssetCard from './AssetCard';

describe('AssetCard', () => {
  it('renders to match snapshot', () => {
    const asset = {
      name: 'asset name',
      version: 'asset version',
      assetId: 'asset-1',
      fileLocation: 'file location',
      masterUrl: 'master URL',
      owners: [{ userId: 'owner-1', name: 'name 1' }, { userId: 'owner-2', name: 'name 2' }],
      visibility: 'BY_PROJECT',
      projects: [{ projectKey: 'project-1', name: 'project 1' }, { projectKey: 'project-2', name: 'project 2' }],
    };
    expect(shallow(
      <AssetCard
        asset={asset}
      />,
    )).toMatchSnapshot();
  });
});

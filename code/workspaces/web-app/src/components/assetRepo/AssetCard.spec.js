import React from 'react';
import { render } from '../../testUtils/renderTests';
import AssetCard from './AssetCard';

describe('AssetCard', () => {
  it('Non-EIDC asset renders to match snapshot', () => {
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
    expect(render(
      <AssetCard
        asset={asset}
      />,
    ).container).toMatchSnapshot();
  });
  it('EIDC asset renders to match snapshot', () => {
    const asset = {
      name: 'asset name',
      masterUrl: 'master URL',
      assetId: 'asset-1',
      fileLocation: 'file location',
      visibility: 'BY_PROJECT',
      projects: [{ projectKey: 'project-1', name: 'project 1' }, { projectKey: 'project-2', name: 'project 2' }],
      responsibleUser: { userId: 'owner-1', name: 'name 1' },
      license: 'license',
      citation: 'citation',
      publisher: 'EIDC',
    };
    expect(render(
      <AssetCard
        asset={asset}
      />,
    ).container).toMatchSnapshot();
  });
});

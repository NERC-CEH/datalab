import React from 'react';
import * as ReactRedux from 'react-redux';
import { shallow } from 'enzyme';
import AssetRepoFindContainer from './AssetRepoFindContainer';
import { useAssetRepo } from '../../hooks/assetRepoHooks';

jest.mock('react-router');
jest.mock('../../hooks/assetRepoHooks');

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
const assetRep = { fetching: false, error: null, value: { assets: [asset] } };

describe('AssetRepoFindContainer', () => {
  const shallowRender = () => shallow(<AssetRepoFindContainer />);

  beforeEach(() => {
    const dispatchMock = jest.fn().mockName('dispatch');
    jest.spyOn(ReactRedux, 'useDispatch').mockImplementation(() => dispatchMock);

    useAssetRepo.mockReturnValue(assetRep);
  });

  it('renders to match snapshot passing correct props to children', () => {
    expect(shallowRender()).toMatchSnapshot();
  });
});

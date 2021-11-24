import React from 'react';
import * as ReactRedux from 'react-redux';
import { render } from '@testing-library/react';
import AssetRepoFindContainer from './AssetRepoFindContainer';
import { useAssetRepo } from '../../hooks/assetRepoHooks';
import assetRepoActions from '../../actions/assetRepoActions';
import projectsActions from '../../actions/projectActions';
import userActions from '../../actions/userActions';

jest.mock('react-router');
jest.mock('../../components/common/form/AssetMultiSelect', () => props => (<>AssetMultiSelect </>));
jest.mock('../../components/assetRepo/AssetAccordion', () => props => (<>AssetAccordion {JSON.stringify(props, null, 2)}</>));
jest.mock('../../hooks/assetRepoHooks');

jest.mock('../../actions/assetRepoActions');
jest.mock('../../actions/projectActions');
jest.mock('../../actions/userActions');

const mockLoadAssetsAction = jest.fn();
const mockLoadProjectsAction = jest.fn();
const mockListUsersAction = jest.fn();

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
  beforeEach(() => {
    const dispatchMock = jest.fn().mockName('dispatch');
    jest.spyOn(ReactRedux, 'useDispatch').mockImplementation(() => dispatchMock);

    useAssetRepo.mockReturnValue(assetRep);
    assetRepoActions.loadAssetsForUser = mockLoadAssetsAction;
    projectsActions.loadProjects = mockLoadProjectsAction;
    userActions.listUsers = mockListUsersAction;
  });

  it('renders to match snapshot passing correct props to children', () => {
    expect(render(<AssetRepoFindContainer />).container).toMatchSnapshot();
  });

  it('renders to match snapshot when there are no assets', () => {
    useAssetRepo.mockReturnValue({ fetching: false, error: null, value: { assets: [] } });

    expect(render(<AssetRepoFindContainer />).container).toMatchSnapshot();
  });
});

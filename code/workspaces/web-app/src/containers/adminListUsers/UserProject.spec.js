import React from 'react';
import { shallow } from 'enzyme';
import { useDispatch } from 'react-redux';
import { RSHINY, JUPYTER } from 'common/src/stackTypes';
import UserProject from './UserProject';
import { useProjectsArray } from '../../hooks/projectsHooks';
import { useStacksArray } from '../../hooks/stacksHooks';
import { useDataStorageArray } from '../../hooks/dataStorageHooks';

jest.mock('react-redux');
jest.mock('../../hooks/projectsHooks');
jest.mock('../../hooks/stacksHooks');
jest.mock('../../hooks/dataStorageHooks');
jest.mock('./Projects', () => ({ __esModule: true, default: jest.fn().mockReturnValue(<>PROJECTS_COMPONENT</>) }));
jest.mock('./Sites', () => ({ __esModule: true, default: jest.fn().mockReturnValue(<>SITES_COMPONENT</>) }));
jest.mock('./Notebooks', () => ({ __esModule: true, default: jest.fn().mockReturnValue(<>NOTEBOOKS_COMPONENT</>) }));
jest.mock('./DataStores', () => ({ __esModule: true, default: jest.fn().mockReturnValue(<>DATASTORES_COMPONENT</>) }));

const projectKey = 'proj-1234';
const projectName = 'project name';
const siteName = 'site name';
const notebookName = 'notebook name';
const storageName = 'storage name';

const project = { key: projectKey, name: projectName };
const site = { key: projectKey, name: siteName, type: RSHINY };
const notebook = { key: projectKey, name: notebookName, type: JUPYTER };
const storage = { key: projectKey, name: storageName };

describe('UserProject', () => {
  const shallowRender = () => {
    const filters = {
      instanceAdmin: false,
      projectAdmin: false,
      projectUser: false,
      projectViewer: false,
      siteOwner: false,
      notebookOwner: false,
      storageAccess: false,
    };
    const roles = {
      instanceAdmin: true,
      projectAdmin: [projectKey],
      projectUser: [projectKey],
      projectViewer: [projectKey],
      siteOwner: [{ projectKey, name: siteName }],
      notebookOwner: [{ projectKey, name: notebookName }],
      storageAccess: [{ projectKey, name: storageName }],
    };
    const props = {
      projectKey, filters, roles,
    };

    return shallow(<UserProject {...props} />);
  };

  beforeEach(() => {
    useDispatch.mockReturnValue(jest.fn().mockName('dispatch'));
    useProjectsArray.mockReturnValue({ fetching: false, value: [project] });
    useStacksArray.mockReturnValue({ fetching: false, value: [site, notebook] });
    useDataStorageArray.mockReturnValue({ fetching: false, value: [storage] });
  });

  it('renders to match snapshot passing correct props to children', () => {
    expect(shallowRender()).toMatchSnapshot();
  });
});

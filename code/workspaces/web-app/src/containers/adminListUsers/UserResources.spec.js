import React from 'react';
import { useDispatch } from 'react-redux';
import { render } from '@testing-library/react';
import UserResources from './UserResources';
import { getCatalogue } from '../../config/catalogue';

const user = { name: 'user name', userId: 'uid1' };
const projectKey = 'proj-1234';
const siteName = 'site name';
const notebookName = 'notebook name';
const storageName = 'storage name';

jest.mock('react-redux');
useDispatch.mockReturnValue(jest.fn().mockName('dispatch'));
jest.mock('./UserProject', () => () => (<>user project</>));
jest.mock('../../config/catalogue');

describe('UserResources', () => {
  const filters = {
    instanceAdmin: false,
    dataManager: false,
    projectAdmin: false,
    projectUser: false,
    projectViewer: false,
    siteOwner: false,
    notebookOwner: false,
    storageAccess: false,
  };
  const roles = {
    instanceAdmin: true,
    dataManager: true,
    projectAdmin: [projectKey],
    projectUser: [projectKey],
    projectViewer: [projectKey],
    siteOwner: [{ projectKey, name: siteName }],
    notebookOwner: [{ projectKey, name: notebookName }],
    storageAccess: [{ projectKey, name: storageName }],
  };
  const props = {
    user, filters, roles,
  };

  describe('renders to match snapshot passing correct props to children', () => {
    it('when catalogue is available', () => {
      getCatalogue.mockReturnValueOnce({ available: true });
      expect(render(<UserResources {...props} />).container).toMatchSnapshot();
    });

    it('when catalogue is not available', () => {
      getCatalogue.mockReturnValueOnce({ available: false });
      expect(render(<UserResources {...props} />).container).toMatchSnapshot();
    });
  });
});

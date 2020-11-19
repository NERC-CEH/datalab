import React from 'react';
import { shallow } from 'enzyme';
import UserResources from './UserResources';

const user = { name: 'user name' };
const projectKey = 'proj-1234';
const siteName = 'site name';
const notebookName = 'notebook name';
const storageName = 'storage name';

describe('UserResources', () => {
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
      user, filters, roles,
    };

    return shallow(<UserResources {...props} />);
  };

  it('renders to match snapshot passing correct props to children', () => {
    expect(shallowRender()).toMatchSnapshot();
  });
});

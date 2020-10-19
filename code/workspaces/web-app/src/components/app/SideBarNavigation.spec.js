import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import SideBarNavigation from './SideBarNavigation';

describe('ProjectNavigation', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  const classes = { projectNavigation: 'projectNavigation', contentArea: 'contentArea' };

  it('renders the correct snapshot', () => {
    expect(
      shallow(
        <SideBarNavigation userPermissions="userPermissions" projectKey="testproj" classes={classes}>
          <span>Content</span>
        </SideBarNavigation>,
      ),
    ).toMatchSnapshot();
  });
});

import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import SideBarNavigation from './SideBarNavigation';

describe('ProjectNavigation', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  const SideBar = () => (
  <div>
  </div>
  );

  it('renders the correct snapshot', () => {
    expect(
      shallow(
        <SideBarNavigation sideBar={SideBar}>
          <span>Content</span>
        </SideBarNavigation>,
      ),
    ).toMatchSnapshot();
  });
});

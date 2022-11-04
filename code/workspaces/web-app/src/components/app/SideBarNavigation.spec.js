import React from 'react';
import { render } from '../../testUtils/renderTests';
import SideBarNavigation from './SideBarNavigation';

describe('ProjectNavigation', () => {
  const SideBar = () => (<div>SideBar mock</div>);

  it('renders the correct snapshot', () => {
    const wrapper = render(
      <SideBarNavigation sideBar={<SideBar />}>
        <span>Content</span>
      </SideBarNavigation>,
    );

    expect(wrapper.container).toMatchSnapshot();
  });
});

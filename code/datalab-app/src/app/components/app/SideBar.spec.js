import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { createShallow, createMount } from 'material-ui/test-utils';
import SideBar from './SideBar';

describe('Sidebar', () => {
  function shallowRender(props) {
    const shallow = createShallow({ dive: true });

    return shallow(<SideBar {...props} />);
  }

  function fullRender(path) {
    const mount = createMount();

    return mount(
      <MemoryRouter initialEntries={path}>
        <SideBar/>
      </MemoryRouter>);
  }

  it('correctly renders correct snapshot', () => {
    expect(shallowRender()).toMatchSnapshot();
  });

  it('renders "Dashboard" label as active when on / route', () => {
    // Arrange
    const linkPath = '/';
    const iconName = 'dashboard';
    const linkName = 'Dashboard';

    // Act
    const output = fullRender([linkPath]);

    // Assert
    expect(output.find({ href: linkPath })).toHaveText(`${iconName}${linkName}`);
  });

  it('renders "Storage" label as active when on /storage route', () => {
    // Arrange
    const linkPath = '/storage';
    const linkName = 'Storage';
    const iconName = 'storage';

    // Act
    const output = fullRender([linkPath]);

    // Assert
    expect(output.find({ href: linkPath })).toHaveText(`${iconName}${linkName}`);
  });

  it('renders "Notebooks" label as active when on /storage route', () => {
    // Arrange
    const linkPath = '/notebooks';
    const linkName = 'Notebooks';
    const iconName = 'book';

    // Act
    const output = fullRender([linkPath]);

    // Assert
    expect(output.find({ href: linkPath })).toHaveText(`${iconName}${linkName}`);
  });
});

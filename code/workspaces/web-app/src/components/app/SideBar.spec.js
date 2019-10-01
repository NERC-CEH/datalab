import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { createShallow, createMount } from '@material-ui/core/test-utils';
import { permissionTypes } from 'common';
import SideBar, { StyledSideBarAnalysis } from './SideBar';

const { PROJECT_NAMESPACE } = permissionTypes;

describe('Sidebar', () => {
  const userPermissions = [`${PROJECT_NAMESPACE}:project99:storage:list`, `${PROJECT_NAMESPACE}:project99:stacks:list`, `${PROJECT_NAMESPACE}:project99:settings:list`];
  const projectKey = 'project99';

  function shallowRenderSideBar() {
    const shallow = createShallow({ dive: true });
    const props = { userPermissions, projectKey };

    return shallow(<SideBar {...props} />);
  }

  function shallowRenderStyledSideBarAnalysis() {
    const shallow = createShallow({ dive: true });
    const props = { userPermissions, projectKey };

    return shallow(<StyledSideBarAnalysis {...props} />);
  }

  function fullRender(path) {
    const mount = createMount();
    const props = { userPermissions, projectKey };

    return mount(
      <MemoryRouter initialEntries={path}>
        <StyledSideBarAnalysis {...props} />
      </MemoryRouter>,
    );
  }

  it('correctly renders correct snapshot', () => {
    expect(shallowRenderSideBar()).toMatchSnapshot();
    expect(shallowRenderStyledSideBarAnalysis()).toMatchSnapshot();
  });

  it('renders "Storage" label as active when on /storage route', () => {
    // Arrange
    const linkPath = '/projects/project99/storage';
    const linkName = 'Storage';
    const iconName = 'storage';

    // Act
    const output = fullRender([linkPath]);

    // Assert
    expect(output.find({ href: linkPath })).toHaveText(`${iconName}${linkName}`);
  });

  it('renders "Notebooks" label as active when on /storage route', () => {
    // Arrange
    const linkPath = '/projects/project99/notebooks';
    const linkName = 'Notebooks';
    const iconName = 'book';

    // Act
    const output = fullRender([linkPath]);

    // Assert
    expect(output.find({ href: linkPath })).toHaveText(`${iconName}${linkName}`);
  });

  it('renders "Sites" label as active when on /publishing route', () => {
    // Arrange
    const linkPath = '/projects/project99/publishing';
    const linkName = 'Sites';
    const iconName = 'web';

    // Act
    const output = fullRender([linkPath]);

    // Assert
    expect(output.find({ href: linkPath })).toHaveText(`${iconName}${linkName}`);
  });

  it('renders "Dask" label as active when on /dask route', () => {
    // Arrange
    const linkPath = '/projects/project99/dask';
    const linkName = 'Dask';
    const iconName = 'apps';

    // Act
    const output = fullRender([linkPath]);

    // Assert
    expect(output.find({ href: linkPath })).toHaveText(`${iconName}${linkName}`);
  });

  it('renders "Spark" label as active when on /spark route', () => {
    // Arrange
    const linkPath = '/projects/project99/spark';
    const linkName = 'Spark';
    const iconName = 'apps';

    // Act
    const output = fullRender([linkPath]);

    // Assert
    expect(output.find({ href: linkPath })).toHaveText(`${iconName}${linkName}`);
  });
});

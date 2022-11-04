import React from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { render } from '../../testUtils/renderTests';
import { useCurrentProject } from '../../hooks/currentProjectHooks';
import { useProjectsArray } from '../../hooks/projectsHooks';
import ProjectSwitcher, {
  Switcher,
  getSwitcherProjects,
  createRoute,
} from './ProjectSwitcher';

jest.mock('react-redux');
jest.mock('react-router');
jest.mock('../../hooks/currentProjectHooks');
jest.mock('../../hooks/projectsHooks');
jest.mock('../../actions/projectActions');

// import { Link, useLocation } from 'react-router-dom';
jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
  Link: props => (<div>Link mock {JSON.stringify(props)}</div>),
}));

const testProj = { key: 'testproj', name: 'Test Project', accessible: true };
const state = {
  projects: {
    fetching: false,
    error: null,
    value: [
      testProj,
      { key: 'another', name: 'Another Project', accessible: false },
      { key: 'projthree', name: 'Project Three', accessible: true },
    ],
  },
  currentProject: {
    fetching: false,
    error: null,
    value: testProj,
  },
};

describe('ProjectSwitcher', () => {
  beforeEach(() => {
    const dispatchMock = jest.fn().mockName('dispatch');
    useDispatch.mockReturnValue(dispatchMock);

    useLocation.mockReturnValue({
      name: 'expected location value',
      pathname: '/projects/testproj/info',
    });

    useCurrentProject.mockReturnValue(state.currentProject);
    useProjectsArray.mockReturnValue(state.projects);
  });

  it('renders to match snapshot passing correct parameters to children', () => {
    expect(render(<ProjectSwitcher />).container).toMatchSnapshot();
  });
});

describe('Switcher', () => {
  const classes = {
    switcher: 'switcher',
    dropdownProgress: 'dropdownProgress',
    itemContent: 'itemContent',
    itemKey: 'itemKey',
  };

  const location = {
    pathname: '/projects/testproj/info',
  };

  it('renders to match snapshot when there are accessible projects', () => {
    expect(
      render(
        <Switcher
          switcherProjects={getSwitcherProjects(state.projects, state.currentProject)}
          currentProject={state.currentProject}
          location={location}
          classes={classes}
        />,
      ).container,
    ).toMatchSnapshot();
  });

  it('renders to match snapshot when there are no projects to display', () => {
    expect(
      render(
        <Switcher
          switcherProjects={{ value: [] }}
          currentProject={{}}
          location={location}
          classes={classes}
        />,
      ).container,
    ).toMatchSnapshot();
  });

  it('renders to match snapshot when switcherProjects is fetching', () => {
    expect(
      render(
        <Switcher
          switcherProjects={{ fetching: true, value: [] }}
          currentProject={state.currentProject}
          location={location}
          classes={classes}
        />,
      ).container,
    ).toMatchSnapshot();
  });
});

describe('createRoute', () => {
  it('replaces the project key in the url with the provided project key', () => {
    expect(
      createRoute({ pathname: '/projects/currentproject/info' }, 'newkey'),
    ).toEqual('/projects/newkey/info');

    expect(
      createRoute({ pathname: '/projects/someproject/notebooks' }, 'anotherkey'),
    ).toEqual('/projects/anotherkey/notebooks');
  });
});

describe('getSwitcherProjects', () => {
  it('filters projects to only return those accessible to user and currentProject if defined', () => {
    expect(getSwitcherProjects(state.projects, state.currentProject)).toEqual({
      fetching: false,
      error: null,
      value: [
        testProj,
        { key: 'projthree', name: 'Project Three', accessible: true },
      ],
    });

    const nonAccessibleProj = { ...state.currentProject, value: { key: 'noaccess', name: 'No Access but Current' } };
    expect(getSwitcherProjects(state.projects, nonAccessibleProj)).toEqual({
      fetching: false,
      error: null,
      value: [
        testProj,
        { key: 'projthree', name: 'Project Three', accessible: true },
        nonAccessibleProj.value,
      ],
    });

    const undefCurrentProj = { ...state.currentProject, value: {} };
    expect(getSwitcherProjects(state.projects, undefCurrentProj)).toEqual({
      fetching: false,
      error: null,
      value: [
        testProj,
        { key: 'projthree', name: 'Project Three', accessible: true },
      ],
    });
  });
});

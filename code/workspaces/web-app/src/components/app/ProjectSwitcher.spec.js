import React from 'react';
import { shallow } from 'enzyme';
import { useDispatch } from 'react-redux';
import useCurrentProject from '../../hooks/useCurrentProject';
import useProjectsArray from '../../hooks/useProjectsArray';
import ProjectSwitcher, { Switcher,
  getSwitcherProjects,
  createRoute } from './ProjectSwitcher';

jest.mock('react-redux');
jest.mock('../../hooks/useCurrentProject');
jest.mock('../../hooks/useProjectsArray');
jest.mock('../../actions/projectActions');

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
  const dispatchMock = jest.fn().mockName('dispatch');
  useDispatch.mockReturnValue(dispatchMock);

  useCurrentProject.mockReturnValue(state.currentProject);
  useProjectsArray.mockReturnValue(state.projects);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders to match snapshot passing correct parameters to children', () => {
    expect(shallow(<ProjectSwitcher />).dive()).toMatchSnapshot();
  });
});

describe('Switcher', () => {
  const classes = {
    switcher: 'switcher',
    dropdownProgress: 'dropdownProgress',
  };

  const location = {
    pathname: '/projects/testproj/info',
  };

  it('renders to match snapshot when there are accessible projects', () => {
    expect(
      shallow(
        <Switcher
          switcherProjects={getSwitcherProjects(state.projects, state.currentProject)}
          currentProject={testProj}
          location={location}
          classes={classes}
        />,
      ),
    ).toMatchSnapshot();
  });

  it('renders to match snapshot when there are projects to display', () => {
    expect(
      shallow(
        <Switcher
          switcherProjects={{ value: [] }}
          currentProject={{}}
          location={location}
          classes={classes}
        />,
      ),
    ).toMatchSnapshot();
  });

  it('renders to match snapshot when switcherProjects is fetching', () => {
    expect(
      shallow(
        <Switcher
          switcherProjects={{ fetching: true, value: [] }}
          currentProject={testProj}
          location={location}
          classes={classes}
        />,
      ),
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
  it('filters projects to only return those accessible to user and currentProject', () => {
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
  });
});

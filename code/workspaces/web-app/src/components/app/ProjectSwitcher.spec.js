import React from 'react';
import { shallow } from 'enzyme';
import { useDispatch } from 'react-redux';
import useCurrentProjectKey from '../../hooks/useCurrentProjectKey';
import useProjectsArray from '../../hooks/useProjectsArray';
import ProjectSwitcher, { Switcher,
  getAccessibleProjects,
  createRoute } from './ProjectSwitcher';

jest.mock('react-redux');
jest.mock('../../hooks/useCurrentProjectKey');
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

  useCurrentProjectKey.mockReturnValue(state.currentProject);
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
          accessibleProjects={getAccessibleProjects(state.projects)}
          currentProject={testProj}
          location={location}
          classes={classes}
        />,
      ),
    ).toMatchSnapshot();
  });

  it('renders to match snapshot when there are no accessible projects', () => {
    expect(
      shallow(
        <Switcher
          accessibleProjects={{ value: [] }}
          currentProject={{}}
          location={location}
          classes={classes}
        />,
      ),
    ).toMatchSnapshot();
  });

  it('renders to match snapshot when accessibleProjects is fetching', () => {
    expect(
      shallow(
        <Switcher
          accessibleProjects={{ fetching: true, value: [] }}
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

describe('getAccessibleProjects', () => {
  it('filters projects to only return those accessible to user', () => {
    expect(getAccessibleProjects(state.projects)).toEqual({
      fetching: false,
      error: null,
      value: [
        testProj,
        { key: 'projthree', name: 'Project Three', accessible: true },
      ],
    });
  });
});

import React from 'react';
import { useDispatch } from 'react-redux';
import { render } from '../../testUtils/renderTests';
import ProjectInfoContainer, { PureProjectInfoContainer, CollaborationLink } from './ProjectInfoContainer';
import { useCurrentProject } from '../../hooks/currentProjectHooks';
import { useProjectUsers } from '../../hooks/projectUsersHooks';
import projectSettingsActions from '../../actions/projectSettingsActions';

jest.mock('../../hooks/currentProjectHooks');
jest.mock('../../hooks/projectUsersHooks');
jest.mock('../../actions/projectSettingsActions');
jest.mock('react-redux');

const testProj = {
  key: 'testproj',
  name: 'Test Project',
  description: 'A description about Test Project.',
  collaborationLink: 'https://testlab.test-datalabs.nerc.ac.uk',
};

const currentProject = { fetching: false, value: testProj };
const projectUsers = { fetching: false, value: [{ userId: 'user1', name: 'user1@test', role: 'user' }] };
const dispatchMock = jest.fn().mockName('dispatch');

beforeEach(() => {
  useCurrentProject.mockReturnValue(currentProject);
  useProjectUsers.mockReturnValue(projectUsers);
  useDispatch.mockReturnValue(dispatchMock);
  projectSettingsActions.getProjectUserPermissions.mockReturnValue({});
});

describe('ProjectInfoContainer', () => {
  it('renders correctly passing correct props to children', () => {
    expect(render(<ProjectInfoContainer/>).container).toMatchSnapshot();
  });
  it('renders correctly when there are multiple users', () => {
    useProjectUsers.mockReturnValueOnce({
      fetching: false,
      value: [
        { userId: 'user1', name: 'user1@test', role: 'user' },
        { userId: 'user2', name: 'user2@test', role: 'viewer' },
        { userId: 'user3', name: 'user3@test', role: 'user' },
        { userId: 'user4', name: 'user4@test', role: 'admin' },
      ],
    });
    expect(render(<ProjectInfoContainer/>).container).toMatchSnapshot();
  });
});

describe('PureProjectInfoContainer', () => {
  describe('renders correctly to match snapshot', () => {
    it('when there is a collaboration link', () => {
      expect(
        render(<PureProjectInfoContainer currentProject={currentProject} />).container,
      ).toMatchSnapshot();
    });

    it('when there is not a collaboration link', () => {
      const project = {
        ...currentProject,
        value: {
          ...testProj,
          collaborationLink: undefined,
        },
      };
      expect(
        render(<PureProjectInfoContainer currentProject={project} />).container,
      ).toMatchSnapshot();
    });
  });
});

describe('CollaborationLink', () => {
  describe('renders correctly to match snapshot', () => {
    it('when there is a collaboration link', () => {
      expect(
        render(<CollaborationLink link={testProj.collaborationLink} />).container,
      ).toMatchSnapshot();
    });

    it('when there is not a collaboration link', () => {
      expect(
        render(<CollaborationLink link={undefined} />).container,
      ).toMatchSnapshot();
    });
  });
});

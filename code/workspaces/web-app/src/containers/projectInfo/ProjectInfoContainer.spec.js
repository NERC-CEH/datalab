import React from 'react';
import { useDispatch } from 'react-redux';
import { shallow } from 'enzyme';
import ProjectInfoContainer, { PureProjectInfoContainer, CollaborationLink } from './ProjectInfoContainer';
import { useCurrentProject } from '../../hooks/currentProjectHooks';
import { useProjectUsers } from '../../hooks/projectUsersHooks';

jest.mock('../../hooks/currentProjectHooks');
jest.mock('../../hooks/projectUsersHooks');
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
});

describe('ProjectInfoContainer', () => {
  it('renders correctly passing correct props to children', () => {
    expect(shallow(<ProjectInfoContainer/>)).toMatchSnapshot();
  });
});

describe('PureProjectInfoContainer', () => {
  describe('renders correctly to match snapshot', () => {
    it('when there is a collaboration link', () => {
      expect(
        shallow(<PureProjectInfoContainer currentProject={currentProject} />),
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
        shallow(<PureProjectInfoContainer currentProject={project} />),
      ).toMatchSnapshot();
    });
  });
});

describe('CollaborationLink', () => {
  describe('renders correctly to match snapshot', () => {
    it('when there is a collaboration link', () => {
      expect(
        shallow(<CollaborationLink link={testProj.collaborationLink} />),
      ).toMatchSnapshot();
    });

    it('when there is not a collaboration link', () => {
      expect(
        shallow(<CollaborationLink link={undefined} />),
      ).toMatchSnapshot();
    });
  });
});

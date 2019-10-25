import React from 'react';
import { shallow } from 'enzyme';
import ProjectInfoContainer, { PureProjectInfoContainer, CollaborationLink } from './ProjectInfoContainer';
import { useCurrentProject } from '../../hooks/currentProjectHooks';

jest.mock('../../hooks/currentProjectHooks');

const testProj = {
  key: 'testproj',
  name: 'Test Project',
  description: 'A description about Test Project.',
  collaborationLink: 'https://testlab.test-datalabs.nerc.ac.uk',
};

const currentProject = { fetching: false, value: testProj };

useCurrentProject.mockReturnValue(currentProject);

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

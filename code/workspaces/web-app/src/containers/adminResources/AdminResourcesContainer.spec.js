import React from 'react';
import { useDispatch } from 'react-redux';
import { render } from '../../testUtils/renderTests';
import AdminResourcesContainer from './AdminResourcesContainer';
import { useProjectsArray } from '../../hooks/projectsHooks';
import projectActions from '../../actions/projectActions';
import userActions from '../../actions/userActions';

jest.mock('react-redux');
jest.mock('../../hooks/projectsHooks');
jest.mock('../../actions/projectActions');
jest.mock('../../actions/userActions');
jest.mock('../../components/common/form/ProjectMultiSelect', () => props => (<>ProjectMultiSelect {JSON.stringify(props)}</>));
jest.mock('./ProjectResources', () => props => (<>project resources {JSON.stringify(props)}</>));

const project1 = { key: 'testproj1', name: 'Test Project 1' };
const project2 = { key: 'testproj2', name: 'Test Project 2' };

describe('AdminResourcesContainer', () => {
  beforeEach(() => {
    useDispatch.mockReturnValue(jest.fn().mockName('dispatch'));
    useProjectsArray.mockReturnValue({ fetching: false, value: [project1, project2] });

    projectActions.getAllProjectsAndResources = jest.fn();
    userActions.listUsers = jest.fn();
  });

  it('renders correctly passing correct props to children', () => {
    expect(render(<AdminResourcesContainer/>).container).toMatchSnapshot();
  });
});

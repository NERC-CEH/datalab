import React from 'react';
import { useDispatch } from 'react-redux';
import { shallow } from 'enzyme';
import AdminResourcesContainer from './AdminResourcesContainer';
import { useProjectsArray } from '../../hooks/projectsHooks';

jest.mock('react-redux');
jest.mock('../../hooks/projectsHooks');
jest.mock('./ProjectResources', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(<>project resources</>),
}));

const project1 = { key: 'testproj1', name: 'Test Project 1' };
const project2 = { key: 'testproj2', name: 'Test Project 2' };

useDispatch.mockReturnValue(jest.fn().mockName('dispatch'));
useProjectsArray.mockReturnValue({ fetching: false, value: [project1, project2] });

describe('AdminResourcesContainer', () => {
  it('renders correctly passing correct props to children', () => {
    expect(shallow(<AdminResourcesContainer/>)).toMatchSnapshot();
  });
});

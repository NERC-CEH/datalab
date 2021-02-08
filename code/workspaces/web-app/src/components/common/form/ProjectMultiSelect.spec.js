import React from 'react';
import { useDispatch } from 'react-redux';
import { shallow } from 'enzyme';
import { useProjectsArray } from '../../../hooks/projectsHooks';
import ProjectMultiSelect from './ProjectMultiSelect';

jest.mock('react-redux');
jest.mock('../../../hooks/projectsHooks');

const project1 = { key: 'test-proj1', name: 'Test Project 1' };
const project2 = { key: 'test-proj2', name: 'Test Project 2' };

useDispatch.mockReturnValue(jest.fn().mockName('dispatch'));
useProjectsArray.mockReturnValue({ fetching: false, value: [project1, project2] });

describe('ProjectMultiSelect', () => {
  const shallowRender = () => {
    const props = {
      input: {
        value: [project1, project2],
        onChange: jest.fn().mockName('onChange'),
      },
    };

    return shallow(<ProjectMultiSelect {...props} />);
  };

  it('renders to match snapshot passing correct props to children', () => {
    expect(shallowRender()).toMatchSnapshot();
  });
});

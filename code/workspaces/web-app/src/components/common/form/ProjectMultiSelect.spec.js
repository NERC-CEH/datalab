import React from 'react';
import { useDispatch } from 'react-redux';
import { render } from '../../../testUtils/renderTests';
import { useProjectsArray } from '../../../hooks/projectsHooks';
import ProjectMultiSelect from './ProjectMultiSelect';

jest.mock('react-redux');
jest.mock('../../../hooks/projectsHooks');

jest.mock('@mui/lab/Autocomplete', () => props => (<div>Autocomplete mock {JSON.stringify(props)}</div>));

const project1 = { key: 'test-proj1', name: 'Test Project 1' };
const project2 = { key: 'test-proj2', name: 'Test Project 2' };

describe('ProjectMultiSelect', () => {
  const shallowRender = () => {
    const props = {
      input: {
        value: [project1, project2],
        onChange: jest.fn().mockName('onChange'),
      },
    };

    return render(<ProjectMultiSelect {...props} />).container;
  };

  beforeEach(() => {
    useDispatch.mockReturnValue(jest.fn().mockName('dispatch'));
    useProjectsArray.mockReturnValue({ fetching: false, value: [project1, project2] });
  });

  it('renders to match snapshot passing correct props to children', () => {
    expect(shallowRender()).toMatchSnapshot();
  });
});

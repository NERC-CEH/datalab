import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import NavBar from './NavBar';
import { getAuth } from '../../config/authConfig';

jest.mock('../../config/authConfig');
getAuth.mockImplementation(() => ({
  login: jest.fn(),
}));

describe('NavBar', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  it('renders correct snapshot', () => {
    expect(shallow(<NavBar />)).toMatchSnapshot();
  });
});

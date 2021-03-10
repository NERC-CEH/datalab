import React from 'react';
import { shallow } from 'enzyme';
import DaskPage from './DaskPage';

jest.mock('react-redux');
jest.mock('redux-form', () => ({ reset: jest.fn() }));

describe('DaskPage', () => {
  it('renders correct snapshot', () => {
    expect(shallow(<DaskPage />)).toMatchSnapshot();
  });
});

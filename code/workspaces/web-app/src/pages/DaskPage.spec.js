import React from 'react';
import { render } from '../testUtils/renderTests';
import DaskPage from './DaskPage';

jest.mock('react-redux');
jest.mock('redux-form', () => ({ reset: jest.fn() }));

jest.mock('../containers/clusters/ClustersContainer', () => props => (<div>ClustersContainer mock {JSON.stringify(props)}</div>));
jest.mock('../components/app/Footer', () => () => (<div>Footer mock</div>));

describe('DaskPage', () => {
  it('renders correct snapshot', () => {
    expect(render(<DaskPage />).container).toMatchSnapshot();
  });
});

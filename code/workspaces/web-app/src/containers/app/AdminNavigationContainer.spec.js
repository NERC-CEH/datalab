import React from 'react';
import { shallow } from 'enzyme';
import AdminNavigationContainer from './AdminNavigationContainer';

jest.mock('../../pages/AdminMessagesPage', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(<>AdminMessagesPage</>),
}));

describe('AdminNavigationContainer', () => {
  const shallowRender = () => shallow(<AdminNavigationContainer />);

  it('renders to match snapshot passing correct props to children', () => {
    expect(shallowRender()).toMatchSnapshot();
  });
});

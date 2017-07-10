import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount, shallow } from 'enzyme';
import NavBar from './NavBar';

describe('NavBar', () => {
  function fullRender(path) {
    return mount(
      <MemoryRouter initialEntries={path}>
        <NavBar/>
      </MemoryRouter>);
  }

  it('renders correct snapshot', () => {
    expect(shallow(<NavBar/>)).toMatchSnapshot();
  });

  it('renders "DataLabs" label as active when on / route', () => {
    // Arrange/Act
    const output = fullRender(['/']);

    // Assert
    expect(output.find('a.active.item')).toHaveText('DataLabs');
  });

  it('renders "About" label as active when on /about route', () => {
    // Arrange/Act
    const output = fullRender(['/about']);

    // Assert
    expect(output.find('a.active.item')).toHaveText('About');
  });
});

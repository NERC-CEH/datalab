import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount, shallow } from 'enzyme';
import SideBar from './SideBar';

describe('Sidebar', () => {
  function shallowRender(props) {
    return shallow(<SideBar {...props} />);
  }

  function fullRender(path) {
    return mount(
      <MemoryRouter initialEntries={path}>
        <SideBar/>
      </MemoryRouter>);
  }

  it('correctly renders correct snapshot', () => {
    expect(shallowRender()).toMatchSnapshot();
  });

  it('style is passed to child segment', () => {
    expect(shallowRender({ topBarStyle: { element: 'expectedTopBarStyle' } }).find('Segment').prop('style')).toEqual({ element: 'expectedTopBarStyle' });
  });

  it('renders "Dashboard" label as active when on / route', () => {
    // Arrange/Act
    const output = fullRender(['/']);

    // Assert
    expect(output.find('a.active.item')).toHaveText('Dashboard');
  });

  it('renders "Storage" label as active when on /storage route', () => {
    // Arrange/Act
    const output = fullRender(['/storage']);

    // Assert
    expect(output.find('a.active.item')).toHaveText('Storage');
  });
});

import React from 'react';
import { render } from '@testing-library/react';
import SideBarGroup from './SideBarGroup';

describe('SideBarGroup', () => {
  describe('when no children provided', () => {
    it('renders nothing when no title provided', () => {
      const wrapper = render(<SideBarGroup />);
      expect(wrapper.container).toMatchSnapshot();
    });

    it('renders nothing when title provided', () => {
      const wrapper = render(<SideBarGroup title='Group Title' />);
      expect(wrapper.container).toMatchSnapshot();
    });
  });

  describe('when children provided', () => {
    it('renders children when no title provided', () => {
      const wrapper = render(<SideBarGroup><div>test div content</div></SideBarGroup>);
      expect(wrapper.container).toMatchSnapshot();
    });

    it('renders children and title when title provided', () => {
      const wrapper = render(<SideBarGroup title='Test Group'><div>test div content</div></SideBarGroup>);
      expect(wrapper.container).toMatchSnapshot();
    });
  });
});

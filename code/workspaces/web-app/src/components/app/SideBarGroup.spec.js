import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import SideBarGroup from './SideBarGroup';

describe('SideBarGroup', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  describe('when no children provided', () => {
    it('renders nothing when no title provided', () => {
      expect(
        shallow(<SideBarGroup />),
      ).toMatchSnapshot();
    });

    it('renders nothing when title provided', () => {
      expect(
        shallow(<SideBarGroup title='Group Title' />),
      ).toMatchSnapshot();
    });
  });

  describe('when children provided', () => {
    it('renders children when no title provided', () => {
      expect(
        shallow(<SideBarGroup><div>test div content</div></SideBarGroup>),
      ).toMatchSnapshot();
    });

    it('renders children and title when title provided', () => {
      expect(
        shallow(<SideBarGroup title='Test Group'><div>test div content</div></SideBarGroup>),
      ).toMatchSnapshot();
    });
  });
});

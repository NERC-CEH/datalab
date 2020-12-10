import React from 'react';
import { shallow } from 'enzyme';
import GridSkeleton from './GridSkeleton';

// By default class names from makeStyles have a counter that is incremented each time they
// are used. This means that the test results are not repeatable as it is reliant on order
// hence this mock is being used. The rest of the styles framework needs to remain unmocked.
jest.mock(
  '@material-ui/core/styles',
  () => ({
    ...jest.requireActual('@material-ui/core/styles'),
    makeStyles: jest.fn().mockReturnValue(() => ({ grid: 'mockMakeStyles-grid' })),
  }),
);

describe('GridSkeleton', () => {
  it('renders the correct number of items to fill grid', () => {
    const columns = 2;
    const rows = 4;
    const wrapper = shallow(<GridSkeleton columns={columns} rows={rows} />);
    expect(wrapper.children().length).toBe(rows * columns);
  });

  it('renders correct children passing down provided props to children', () => {
    const sizingText = 'Test sizing text';
    const sizingTextVariant = 'h5';
    const wrapper = shallow(<GridSkeleton sizingText={sizingText} sizingTextVariant={sizingTextVariant} />);
    expect(wrapper.childAt(0)).toMatchSnapshot();
  });

  it('renders to match snapshot for 1 x 2 grid', () => {
    expect(shallow(<GridSkeleton rows={1} columns={2} />)).toMatchSnapshot();
  });

  describe('correctly constructs final class name from default class names and provided class name when', () => {
    it('when no class name is provided', () => {
      const wrapper = shallow(<GridSkeleton />);
      expect(wrapper.prop('className')).toMatchSnapshot();
    });

    it('when class name is provided', () => {
      const wrapper = shallow(<GridSkeleton className="test-class-name"/>);
      expect(wrapper.prop('className')).toMatchSnapshot();
    });
  });
});

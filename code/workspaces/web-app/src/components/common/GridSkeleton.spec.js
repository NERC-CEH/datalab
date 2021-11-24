import React from 'react';
import { render, within } from '@testing-library/react';
import GridSkeleton from './GridSkeleton';

describe('GridSkeleton', () => {
  it('renders the correct number of items to fill grid', () => {
    const columns = 2;
    const rows = 4;
    const wrapper = render(<GridSkeleton columns={columns} rows={rows} />);
    expect(within(wrapper.container.firstChild).getAllByText('Text to infer size from').length).toBe(rows * columns);
  });

  it('renders correct children passing down provided props to children', () => {
    const sizingText = 'Test sizing text';
    const sizingTextVariant = 'h5';
    const wrapper = render(<GridSkeleton sizingText={sizingText} sizingTextVariant={sizingTextVariant} />).container;
    expect(wrapper).toMatchSnapshot();
  });

  it('renders to match snapshot for 1 x 2 grid', () => {
    expect(render(<GridSkeleton rows={1} columns={2} />).container).toMatchSnapshot();
  });

  describe('correctly constructs final class name from default class names and provided class name when', () => {
    it('when no class name is provided', () => {
      const wrapper = render(<GridSkeleton />).container;
      expect(wrapper.firstChild.className).toEqual('makeStyles-grid-130 makeStyles-grid-131');
    });

    it('when class name is provided', () => {
      const wrapper = render(<GridSkeleton className="test-class-name"/>).container;
      expect(wrapper.firstChild.className).toEqual('makeStyles-grid-173 makeStyles-grid-174 test-class-name');
    });
  });
});

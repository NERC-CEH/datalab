import React from 'react';
import { render } from '@testing-library/react';
import Pagination, { calculateNumberOfPages } from './Pagination';

jest.mock('./PaginationControls', () => props => (<>PaginationControls Mock {JSON.stringify(props)}</>));

describe('Pagination', () => {
  function renderComponent(props) {
    return render(<Pagination {...props} />).container;
  }

  function generateProps(numItems, itemsPerPage, paginationBarItems, itemsName) {
    const items = [];
    for (let i = 0; i < numItems; i++) {
      items.push(<div key={i}>Item {i}</div>);
    }
    return {
      items,
      itemsPerPage,
      paginationBarItems,
      itemsName,
    };
  }

  it('renders the correct number of items from the start of the array on the first page', () => {
    const props = generateProps(10, 5, undefined, undefined);
    const output = renderComponent(props);
    expect(output).toMatchSnapshot();
  });

  it('renders single additional item in control bar after pagination controls in own div', () => {
    const barItem = <span>Bar Item</span>;
    const props = generateProps(4, 2, barItem, 'bar items');
    const output = renderComponent(props);
    expect(output).toMatchSnapshot();
  });

  it('renders array of additional items in control bar after pagination controls in own div', () => {
    const barItems = [<span key={0}>Bar Item 1</span>, <span key={1}>Bar Item 1</span>];
    const props = generateProps(4, 2, barItems, 'bar items');
    const output = renderComponent(props);
    expect(output).toMatchSnapshot();
  });

  it('skips div for pagination controls and bar item if only one page and no bar item', () => {
    const props = generateProps(2, 2, null, 'bar items');
    const output = renderComponent(props);
    expect(output).toMatchSnapshot();
  });
});

describe('calculateNumberOfPages', () => {
  it('gives 1 page when there are no items', () => {
    expect(calculateNumberOfPages(0, 10)).toBe(1);
  });

  it('gives 1 page when there are less items than itemsPerPage', () => {
    expect(calculateNumberOfPages(5, 10)).toBe(1);
  });

  it('gives 1 page when there are the same number of items as itemsPerPage', () => {
    expect(calculateNumberOfPages(10, 10)).toBe(1);
  });

  it('gives 2 pages when items > itemsPerPage and items < 2 * itemsPerPage', () => {
    expect(calculateNumberOfPages(12, 10)).toBe(2);
  });
});

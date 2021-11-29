import React from 'react';
import { render } from '@testing-library/react';
import PaginationControls from './PaginationControls';

jest.mock('./PaginationControlTextField', () => props => (<>PaginationControlTextField Mock {JSON.stringify(props)}</>));
jest.mock('./PaginationControlButton', () => props => (<>PaginationControlButton Mock {JSON.stringify(props)}</>));

describe('PaginationControls', () => {
  function renderComponent(props) {
    return render(<PaginationControls {...props} />);
  }

  function generateProps(pageNum, setPageNum, numPages, itemsName = null) {
    return { pageNum, setPageNum, numPages, itemsName };
  }

  const getIdQuery = (id, disabled) => `"id":"${id}","disabled":${disabled}`;

  const queryComponent = (component, id, disabled) => component.queryByText(getIdQuery(id, disabled), { exact: false });

  it('renders with children in correct order', () => {
    const props = generateProps(0, () => {}, 5);
    const wrapper = renderComponent(props);
    expect(wrapper.container).toMatchSnapshot();
  });

  describe('has a previous page button that', () => {
    it('renders as disabled when on page 0', () => {
      const props = generateProps(0, () => {}, 5);
      const wrapper = renderComponent(props);
      const previousPage = queryComponent(wrapper, 'previous-page', true);
      expect(previousPage).not.toBeNull();
    });

    it('renders as not disabled when not on page 0', () => {
      const props = generateProps(1, () => {}, 5);
      const wrapper = renderComponent(props);
      const previousPage = queryComponent(wrapper, 'previous-page', false);
      expect(previousPage).not.toBeNull();
    });
  });

  describe('has a next page button that', () => {
    it('renders as disabled when on the last page', () => {
      const props = generateProps(1, () => {}, 2);
      const wrapper = renderComponent(props);
      const nextPage = queryComponent(wrapper, 'next-page', true);
      expect(nextPage).not.toBeNull();
    });

    it('renders as not disabled when not on last page', () => {
      const props = generateProps(0, () => {}, 5);
      const wrapper = renderComponent(props);
      const nextPage = queryComponent(wrapper, 'next-page', false);
      expect(nextPage).not.toBeNull();
    });
  });

  describe('has page text that', () => {
    it('renders as "Page" by default', () => {
      const props = generateProps(0, () => {}, 5);
      const wrapper = renderComponent(props);
      expect(wrapper.queryByText('Page')).not.toBeNull();
    });

    it('renders as "Somethings page" if you ask for it', () => {
      const props = generateProps(0, () => {}, 5, 'Somethings');
      const wrapper = renderComponent(props);
      expect(wrapper.queryByText('Page')).toBeNull();
      expect(wrapper.queryByText('Somethings page')).not.toBeNull();
    });
  });
});

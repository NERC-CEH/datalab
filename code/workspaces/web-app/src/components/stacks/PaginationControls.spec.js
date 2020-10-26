import React from 'react';
import { shallow } from 'enzyme';
import PaginationControls from './PaginationControls';
import PaginationControlTextField from './PaginationControlTextField';

describe('PaginationControls', () => {
  function shallowRender(props) {
    return shallow(<PaginationControls {...props} />);
  }

  function generateProps(pageNum, setPageNum, numPages, itemsName = null) {
    return { pageNum, setPageNum, numPages, itemsName };
  }

  it('renders with children in correct order', () => {
    const props = generateProps(0, () => {}, 5);
    const render = shallowRender(props);
    expect(render).toMatchSnapshot();
  });

  describe('has a previous page button that', () => {
    function findPreviousPageButton(render) {
      return render.find('#previous-page');
    }

    it('renders as disabled when on page 0', () => {
      const props = generateProps(0, () => {}, 5);
      const render = shallowRender(props);
      const previousPageButton = findPreviousPageButton(render);
      expect(previousPageButton).toMatchSnapshot();
    });

    it('renders as not disabled when not on page 0', () => {
      const props = generateProps(1, () => {}, 5);
      const render = shallowRender(props);
      const previousPageButton = findPreviousPageButton(render);
      expect(previousPageButton).toMatchSnapshot();
    });
  });

  describe('has a next page button that', () => {
    function findNextPageButton(render) {
      return render.find('#next-page');
    }

    it('renders as disabled when on the last page', () => {
      const props = generateProps(1, () => {}, 2);
      const render = shallowRender(props);
      const nextPageButton = findNextPageButton(render);
      expect(nextPageButton).toMatchSnapshot();
    });

    it('renders as not disabled when not on last page', () => {
      const props = generateProps(0, () => {}, 5);
      const render = shallowRender(props);
      const nextPageButton = findNextPageButton(render);
      expect(nextPageButton).toMatchSnapshot();
    });
  });

  describe('has a PaginationControlTextField that', () => {
    function findPaginationControlTextField(render) {
      return render.find(PaginationControlTextField);
    }

    it('renders with pageInputValue prop of pageNum + 1', () => {
      const props = generateProps(0, () => {}, 5);
      const render = shallowRender(props);
      const textField = findPaginationControlTextField(render);
      expect(textField).toMatchSnapshot();
    });
  });

  describe('has page text that', () => {
    function findPageTextDiv(render) {
      return render.find('#page-text');
    }

    it('renders as "Page" by default', () => {
      const props = generateProps(0, () => {}, 5);
      const render = shallowRender(props);
      const pageTextDiv = findPageTextDiv(render);
      expect(pageTextDiv).toMatchSnapshot();
    });

    it('renders as "Somethings page" if you ask for it', () => {
      const props = generateProps(0, () => {}, 5, 'Somethings');
      const render = shallowRender(props);
      const pageTextDiv = findPageTextDiv(render);
      expect(pageTextDiv).toMatchSnapshot();
    });
  });
});

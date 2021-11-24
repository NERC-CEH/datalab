import React from 'react';
import { render } from '@testing-library/react';
import PromisedContentWrapper, { ClassWrapper, SizeWrapper, createClassName } from './PromisedContentWrapper';

describe('PromisedContentWrapper', () => {
  function shallowRender(props) {
    return render(
      <PromisedContentWrapper {...props}>
        <span>
          {props.promise.value}
        </span>
      </PromisedContentWrapper>,
    ).container;
  }

  describe('with no classNames or widths', () => {
    it('renders spinner if fetching', () => {
      const props = {
        promise: {
          fetching: true,
          error: null,
          value: '',
        },
        fullWidth: false,
      };

      expect(shallowRender(props)).toMatchSnapshot();
    });

    it('renders children if the promise is resolved', () => {
      const props = {
        promise: {
          fetching: false,
          error: null,
          value: 'PromisedValue',
        },
        fullWidth: false,
      };

      expect(shallowRender(props)).toMatchSnapshot();
    });
  });

  describe('with a width setting', () => {
    it('renders content inside a SizeWrapper when it is fetching', () => {
      const props = { promise: { fetching: true } };
      expect(shallowRender(props)).toMatchSnapshot();
    });

    it('renders without SizeWrapper when it is resolved', () => {
      const props = { promise: { fetching: false, value: 'Promise Value' } };
      expect(shallowRender(props)).toMatchSnapshot();
    });
  });

  describe('with a className', () => {
    describe('renders content inside a ClassWrapper', () => {
      it('when fetching', () => {
        const props = {
          promise: { fetching: true },
          className: 'className',
          fetchingClassName: 'fetchingClassName',
          fullWidth: false,
        };
        expect(shallowRender(props)).toMatchSnapshot();
      });

      it('when not fetching', () => {
        const props = {
          promise: { fetching: false, value: 'Promise Value' },
          className: 'className',
          fetchingClassName: 'fetchingClassName',
          fullWidth: false,
        };
        expect(shallowRender(props)).toMatchSnapshot();
      });
    });
  });

  describe('with both className and width value', () => {
    it('renders to wrap content in both Size and Class Wrappers when fetching', () => {
      const props = {
        promise: { fetching: true },
        fullWidth: true,
        className: 'className',
      };

      expect(shallowRender(props)).toMatchSnapshot();
    });
  });
});

describe('ClassWrapper', () => {
  const shallowRender = props => render(<ClassWrapper {...props} />).container;

  describe('renders with correct class name when', () => {
    describe('className and fetchingClassName are defined and is', () => {
      const classNames = {
        className: 'className',
        fetchingClassName: 'fetchingClassName',
      };

      it('not fetching', () => {
        expect(shallowRender({ ...classNames, isFetching: false }))
          .toMatchSnapshot();
      });

      it('fetching', () => {
        expect(shallowRender({ ...classNames, isFetching: true }))
          .toMatchSnapshot();
      });
    });

    describe('only className is defined and is', () => {
      const classNames = { className: 'className' };

      it('notFetching', () => {
        expect(shallowRender({ ...classNames, isFetching: false }))
          .toMatchSnapshot();
      });

      it('fetching', () => {
        expect(shallowRender({ ...classNames, isFetching: true }))
          .toMatchSnapshot();
      });
    });

    describe('only fetchingClassNameDefined and is', () => {
      const classNames = { fetchingClassName: 'fetchingClassName' };

      it('not fetching', () => {
        expect(shallowRender({ ...classNames, isFetching: false }))
          .toMatchSnapshot();
      });

      it('fetching', () => {
        expect(shallowRender({ ...classNames, isFetching: true }))
          .toMatchSnapshot();
      });
    });
  });

  it('correctly renders with children', () => {
    expect(render(
      <ClassWrapper className="className">
        <span>Child Content</span>
      </ClassWrapper>,
    ).container).toMatchSnapshot();
  });
});

describe('SizeWrapper', () => {
  describe('renders with correct classname when', () => {
    it('is fullWidth', () => {
      expect(render(<SizeWrapper fullWidth />).container).toMatchSnapshot();
    });

    it('is fullHeight', () => {
      expect(render(<SizeWrapper fullHeight />).container).toMatchSnapshot();
    });

    it('is fullHeight and fullWidth', () => {
      expect(render(<SizeWrapper fullHeight fullWidth />).container).toMatchSnapshot();
    });
  });

  it('correctly renders with children', () => {
    expect(render(
      <SizeWrapper fullHeight fullWidth >
        <span>Child Content</span>
      </SizeWrapper>,
    ).container).toMatchSnapshot();
  });
});

describe('createClassName', () => {
  it('returns single name if only called with single name', () => {
    const testName = 'testName';
    expect(createClassName(testName)).toEqual(testName);
  });

  it('filters falsy names and joins the remaining with spaces', () => {
    expect(
      createClassName('one', undefined, 'two', '', 'three', null),
    ).toEqual('one two three');
  });
});

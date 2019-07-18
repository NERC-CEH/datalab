import React from 'react';
import { shallow } from 'enzyme';
import { CircularProgress } from '@material-ui/core/Progress';
import PromisedContentWrapper from './PromisedContentWrapper';

describe('PromisedContentWrapper', () => {
  function shallowRender(promise) {
    return shallow(
      <PromisedContentWrapper promise={promise}>
        <span>
          {promise.value}
        </span>
      </PromisedContentWrapper>);
  }

  it('renders Loader if fetching', () => {
    // Arrange
    const promise = {
      fetching: true,
      error: null,
      value: '',
    };

    // Act
    const output = shallowRender(promise);

    // Assert
    expect(output.children().length).toBe(1);
    expect(output.children().type()).toBe(CircularProgress);
  });

  it('renders expected content if the promise is resolved', () => {
    // Arrange
    const promise = {
      fetching: false,
      error: null,
      value: 'PromisedValue',
    };

    // Act
    const output = shallowRender(promise);

    // Assert
    expect(output.children().length).toBe(1);
    expect(output.childAt(0).prop('children')).toBe('PromisedValue');
  });
});

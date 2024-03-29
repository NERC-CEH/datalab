import React from 'react';
import { render } from '../../testUtils/renderTests';
import PromisedContentSkeletonWrapper from './PromisedContentSkeletonWrapper';

const TestSkeleton = props => <div>This is a test SKELETON component. props:{JSON.stringify(props)}</div>;
const TestChild = props => <div>This is a test CHILD component. props:{JSON.stringify(props)}</div>;

const createPromises = (...fetchingValues) => {
  if (fetchingValues.length === 0) throw new Error('Must provide at lease one fetching value');
  if (fetchingValues.length === 1) return { fetching: fetchingValues[0] };
  return fetchingValues.map(fetching => ({ fetching }));
};

const expectRenderToMatchSnapshotWithFetchingValues = (...fetchingValues) => {
  const promises = createPromises(...fetchingValues);
  const wrapper = render(
    <PromisedContentSkeletonWrapper promises={promises} skeletonComponent={TestSkeleton}>
      <TestChild />
    </PromisedContentSkeletonWrapper>,
  ).container;
  expect(wrapper).toMatchSnapshot();
};

describe('PromisedContentSkeletonWrapper', () => {
  describe('when passed a single promise', () => {
    it('renders child component when promise is not fetching', () => {
      expectRenderToMatchSnapshotWithFetchingValues(false);
    });

    it('renders skeleton component when promise is fetching', () => {
      expectRenderToMatchSnapshotWithFetchingValues(true);
    });
  });

  describe('when passed multiple promises', () => {
    it('renders child component when none of the promises are fetching', () => {
      expectRenderToMatchSnapshotWithFetchingValues(false, false, false);
    });

    it('renders skeleton component when all promises are fetching', () => {
      expectRenderToMatchSnapshotWithFetchingValues(true, true, true);
    });

    it('renders skeleton component when one promise is fetching', () => {
      expectRenderToMatchSnapshotWithFetchingValues(false, true, false);
    });
  });

  it('passes skeletonProps to skeletonComponent when it is being rendered', () => {
    const promise = createPromises(true);
    const wrapper = render(
        <PromisedContentSkeletonWrapper
          promises={promise}
          skeletonComponent={TestSkeleton}
          skeletonProps={{ propOne: 'prop-one', propTwo: 'prop-two' }}
        >
          <TestChild />
        </PromisedContentSkeletonWrapper>,
    ).container;
    expect(wrapper).toMatchSnapshot();
  });
});

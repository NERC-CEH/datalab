import { useClusters, useClustersByType } from './clustersHooks';
import useShallowSelector from './useShallowSelector';
import clustersSelectors from '../selectors/clustersSelectors';

jest.mock('./useShallowSelector');
jest.mock('../selectors/clustersSelectors');

beforeEach(() => {
  useShallowSelector.mockReturnValue('shallow-selector-return');
});

describe('useClusters', () => {
  it('returns useShallowSelector which has been called with the correct selector function', () => {
    const returnValue = useClusters();
    expect(useShallowSelector).toHaveBeenCalledWith(clustersSelectors.clusters);
    expect(returnValue).toEqual('shallow-selector-return');
  });
});

describe('useClustersByType', () => {
  const clusters = [
    { name: 'test1', type: 'DASK' },
    { name: 'test2', type: 'DASK' },
    { name: 'test3', type: 'SPARK' },
  ];

  it('returns value of useClusters filtered by cluster type', () => {
    useShallowSelector.mockReturnValueOnce({
      fetching: false,
      value: clusters,
    });

    const returnValue = useClustersByType('DASK');

    expect(returnValue).toEqual({
      fetching: false,
      // Only contains clusters of the specified type: DASK
      value: [{ name: 'test1', type: 'DASK' }, { name: 'test2', type: 'DASK' }],
    });
  });

  it('returns value of useClusters when no cluster type is specified', () => {
    useShallowSelector.mockReturnValueOnce({
      fetching: false,
      value: clusters,
    });

    const returnValue = useClustersByType(undefined);

    expect(returnValue).toEqual({
      fetching: false,
      value: clusters,
    });
  });
});

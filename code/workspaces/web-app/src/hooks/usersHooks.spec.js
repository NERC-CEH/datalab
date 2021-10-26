import { renderHook } from '@testing-library/react-hooks';
import { useUsersSortedByName } from './usersHooks';
import useShallowSelector from './useShallowSelector';
import usersSelectors from '../selectors/usersSelectors';

jest.mock('../selectors/usersSelectors');
jest.mock('./useShallowSelector');

const createUser = letter => ({ name: `User ${letter.toUpperCase()}`, userId: `user-${letter.toLowerCase()}` });

const userA = createUser('a');
const userB = createUser('b');
const userZ = createUser('z');

const unsortedUsers = [userZ, userA, userB];
const sortedUsers = [userA, userB, userZ];

beforeEach(() => {
  useShallowSelector.mockImplementation(selector => selector());
});

describe('useUsersSortedByName', () => {
  [false, true].forEach((fetching) => {
    it(`returns content for state when fetching is ${fetching}`, () => {
      usersSelectors.users.mockReturnValueOnce({ fetching, value: unsortedUsers });
      const { result } = renderHook(() => useUsersSortedByName());
      expect(result.current).toEqual({ fetching, value: sortedUsers });
    });
  });
});


import { setDismissedMessage, getDismissedMessages, filterExpiredMessages, getMessagesToDisplay, getUpdatedMessages } from './messageStorage';
import LocalStorageMock from '../core/LocalStorageMock';

const storageMock = new LocalStorageMock();
const messages = ['id1', 'id2', 'id3'];
const apiMessages = [{ id: 'id1' }, { id: 'id2' }, { id: 'id3' }];
const key = 'dismissedMessages';

describe('messageStorage', () => {
  beforeAll(() => {
    // Replace the "localStorage" implementation with our mocked version.
    delete global.localStorage;
    global.localStorage = storageMock;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    storageMock.clear();
  });

  describe('setDismissedMessage', () => {
    it('merges new ID with existing messages in cache', () => {
      storageMock.setItem(key, JSON.stringify(messages));

      setDismissedMessage('id4');

      const updated = storageMock.getItem(key);
      expect(JSON.parse(updated)).toEqual([...messages, 'id4']);
    });

    it('does not add duplicate messages to cache', () => {
      storageMock.setItem(key, JSON.stringify(messages));

      setDismissedMessage('id3');

      const updated = storageMock.getItem(key);
      expect(JSON.parse(updated)).toEqual(messages);
    });
  });

  describe('getDismissedMessages', () => {
    it('returns an empty list if there is nothing in the cache', () => {
      const dismissed = getDismissedMessages();

      expect(dismissed).toEqual([]);
    });

    it('returns a list of message IDs', () => {
      const original = JSON.stringify(messages);
      storageMock.setItem(key, original);

      const dismissed = getDismissedMessages();

      expect(dismissed).toEqual(messages);
    });
  });

  describe('filterExpiredMessages', () => {
    it('clears any expired messages from the cache and returns the remaining ones', () => {
      const original = JSON.stringify([...messages, 'old', 'older']);
      storageMock.setItem(key, original);

      const activeDismissedMessages = filterExpiredMessages(apiMessages);
      expect(activeDismissedMessages).toEqual(messages);
    });
  });

  describe('getMessagesToDisplay', () => {
    it('returns an empty list if there are no input messages', () => {
      const toDisplay = getMessagesToDisplay(undefined);

      expect(toDisplay).toEqual([]);
    });

    it('returns a list of message IDs with dismissed ones filtered out', () => {
      storageMock.setItem(key, JSON.stringify(['id1']));

      const toDisplay = getMessagesToDisplay(apiMessages);

      expect(toDisplay).toEqual([{ id: 'id2' }, { id: 'id3' }]);
    });
  });

  describe('getUpdatedMessages', () => {
    it('adds a message ID to the cache and returns the updated list', () => {
      const updated = getUpdatedMessages(apiMessages, 'id1');

      const cacheValue = JSON.parse(storageMock.getItem(key));

      expect(updated).toEqual([{ id: 'id2' }, { id: 'id3' }]);
      expect(cacheValue).toEqual(expect.arrayContaining(['id1']));
      expect(cacheValue).not.toEqual(expect.arrayContaining(['id2']));
    });
  });
});

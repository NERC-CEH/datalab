import mockClient from './graphqlClient';
import messagesService from './messagesService';

jest.mock('./graphqlClient');

const id = 'id1';
const message = {
  id,
  message: 'Test message',
  expiry: '2021-12-25',
  created: '2021-10-31',
};

describe('messagesService', () => {
  beforeEach(() => mockClient.clearResult());

  describe('createMessage', () => {
    it('should build the correct mutation and unpack the results', async () => {
      const creationResponseData = { id };
      mockClient.prepareSuccess(creationResponseData);

      await messagesService.createMessage(message);

      expect(mockClient.lastQuery()).toMatchSnapshot();
      expect(mockClient.lastOptions()).toEqual({ message });
    });

    it('should throw an error if the mutation fails', async () => {
      mockClient.prepareFailure('expected error');

      await expect(messagesService.createMessage(message)).rejects.toEqual({ error: 'expected error' });
    });
  });

  describe('deleteMessage', () => {
    it('should build the correct mutation and unpack the results', async () => {
      const deletionResponseData = { id };
      mockClient.prepareSuccess(deletionResponseData);

      await messagesService.deleteMessage(id);

      expect(mockClient.lastQuery()).toMatchSnapshot();
      expect(mockClient.lastOptions()).toEqual({ messageId: id });
    });

    it('should throw an error if the mutation fails', async () => {
      mockClient.prepareFailure('expected error');

      await expect(messagesService.deleteMessage(id)).rejects.toEqual({ error: 'expected error' });
    });
  });

  describe('getMessages', () => {
    it('should build the correct query and unpack the results', async () => {
      mockClient.prepareSuccess([message]);

      const messagesResponse = await messagesService.getMessages();

      expect(mockClient.lastQuery()).toMatchSnapshot();
      expect(mockClient.lastOptions()).toEqual({});
      expect(messagesResponse).toEqual([message]);
    });

    it('should throw an error if the query fails', async () => {
      mockClient.prepareFailure('expected error');

      await expect(messagesService.getMessages()).rejects.toEqual({ error: 'expected error' });
    });
  });

  describe('getAllMessages', () => {
    it('should build the correct query and unpack the results', async () => {
      mockClient.prepareSuccess([message]);

      const messagesResponse = await messagesService.getAllMessages();

      expect(mockClient.lastQuery()).toMatchSnapshot();
      expect(mockClient.lastOptions()).toEqual({});
      expect(messagesResponse).toEqual([message]);
    });

    it('should throw an error if the query fails', async () => {
      mockClient.prepareFailure('expected error');

      await expect(messagesService.getAllMessages()).rejects.toEqual({ error: 'expected error' });
    });
  });
});


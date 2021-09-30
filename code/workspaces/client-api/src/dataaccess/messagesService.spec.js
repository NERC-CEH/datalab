import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import messagesService from './messagesService';
import config from '../config';

const httpMock = new MockAdapter(axios);
const infrastructureApi = config.get('infrastructureApi');

const token = 'token';

describe('messagesService', () => {
  beforeEach(() => {
    httpMock.reset();
  });

  afterAll(() => {
    httpMock.restore();
  });

  describe('createMessage', () => {
    const messageRequest = {
      message: 'My message',
      expiry: '2021-12-25',
    };
    const messageResponse = {
      ...messageRequest,
      id: '1234',
      created: '2021-12-24',
    };
    const { createMessage } = messagesService;
    it('calls infrastructure-api to create a message', async () => {
      httpMock
        .onPost(`${infrastructureApi}/messages/`)
        .reply(201, messageResponse);

      const returnValue = await createMessage(messageRequest, token);

      expect(returnValue).toEqual(messageResponse);
      expect(httpMock.history.post.length).toBe(1);
      const [postMock] = httpMock.history.post;
      expect(postMock.data).toEqual(JSON.stringify(messageRequest));
      expect(postMock.headers.authorization).toEqual(token);
    });
  });

  describe('deleteMessage', () => {
    const messageResponse = {
      id: '1234',
    };
    const { deleteMessage } = messagesService;
    it('calls infrastructure-api to delete a message', async () => {
      httpMock
        .onDelete(`${infrastructureApi}/messages/1234`)
        .reply(200, messageResponse);

      const returnValue = await deleteMessage('1234', token);

      expect(returnValue).toEqual(messageResponse);
      expect(httpMock.history.delete.length).toBe(1);
      const [deleteMock] = httpMock.history.delete;
      expect(deleteMock.headers.authorization).toEqual(token);
    });
  });

  describe('getMessages', () => {
    const messageResponse = {
      id: '1234',
      message: 'My message',
      expiry: '2021-12-25',
      created: '2021-12-24',
    };
    const { getMessages } = messagesService;
    it('calls infrastructure-api to get active messages', async () => {
      httpMock
        .onGet(`${infrastructureApi}/messages/`)
        .reply(200, [messageResponse]);

      const returnValue = await getMessages(token);

      expect(returnValue).toEqual([messageResponse]);
      expect(httpMock.history.get.length).toBe(1);
      const [getMock] = httpMock.history.get;
      expect(getMock.headers.authorization).toEqual(token);
    });
  });

  describe('getAllMessages', () => {
    const messageResponse1 = {
      id: '1234',
      message: 'My message',
      expiry: '2021-12-25',
      created: '2021-12-24',
    };
    const messageResponse2 = {
      id: '1234',
      message: 'My message',
      expiry: '2020-12-25',
      created: '2020-12-24',
    };
    const { getAllMessages } = messagesService;
    it('calls infrastructure-api to get all messages', async () => {
      httpMock
        .onGet(`${infrastructureApi}/messages/all`)
        .reply(200, [messageResponse1, messageResponse2]);

      const returnValue = await getAllMessages(token);

      expect(returnValue).toEqual([messageResponse1, messageResponse2]);
      expect(httpMock.history.get.length).toBe(1);
      const [getMock] = httpMock.history.get;
      expect(getMock.headers.authorization).toEqual(token);
    });
  });
});

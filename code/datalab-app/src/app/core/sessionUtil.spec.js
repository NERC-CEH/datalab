import { setSession, clearSession } from './sessionUtil';
import { addToLocalStorage, removeFromLocalStorage } from './localStorageUtil';

jest.mock('./localStorageUtil');

describe('SessionUtil', () => {
  beforeEach(() => jest.resetAllMocks());

  it('setSession makes correct amount of calls to addToLocalStorage', () => {
    // Arrange
    const sessionValues = { accessToken: 'a', expiresAt: 'b', idToken: 'c', extraField: 'd', access_token: 'e' };
    // Act
    setSession(sessionValues);
    // Assert
    expect(addToLocalStorage.mock.calls.length).toBe(3);
  });

  it('setSession calls addToLocalStorage with correct arguments', () => {
    // Arrange
    const sessionValues = { accessToken: '1234', expiresAt: '4321', idToken: '5678' };
    // Act
    setSession(sessionValues);
    // Assert
    expect(addToLocalStorage).toBeCalledWith('access_token', '1234');
    expect(addToLocalStorage).toBeCalledWith('expires_at', '4321');
    expect(addToLocalStorage).toBeCalledWith('id_token', '5678');
  });

  it('clearSession makes correct amount of calls to removeFromLocalStorage', () => {
    // Arrange
    const sessionNames = ['accessToken', 'expiresAt', 'idToken', 'extraField', 'access_token'];
    // Act
    clearSession(sessionNames);
    // Assert
    expect(removeFromLocalStorage.mock.calls.length).toBe(3);
  });

  it('clearSession calls removeFromLocalStorage with correct arguments', () => {
    // Arrange
    const sessionNames = ['accessToken', 'expiresAt', 'idToken', 'extraField', 'access_token'];
    // Act
    clearSession(sessionNames);
    // Assert
    expect(removeFromLocalStorage).toBeCalledWith('access_token');
    expect(removeFromLocalStorage).toBeCalledWith('expires_at');
    expect(removeFromLocalStorage).toBeCalledWith('id_token');
  });
});

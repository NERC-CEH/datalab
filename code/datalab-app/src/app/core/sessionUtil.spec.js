import { setSession, clearSession, getSession } from './sessionUtil';
import { addToLocalStorage, removeFromLocalStorage, getFromLocalStorage } from './localStorageUtil';

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

  it('getCurrentSession calls getFromLocalStorage with correct arguments', () => {
    // Act
    getSession();

    // Assert
    expect(getFromLocalStorage).toBeCalledWith('access_token');
    expect(getFromLocalStorage).toBeCalledWith('expires_at');
    expect(getFromLocalStorage).toBeCalledWith('id_token');
  });

  it('getCurrentSession returns current session if present', () => {
    // Arrange
    getFromLocalStorage.mockReturnValue('present');

    // Act/Assert
    expect(getSession()).toEqual({
      accessToken: 'present',
      expiresAt: 'present',
      idToken: 'present',
    });
  });

  it('getCurrentSession returns null if expected fields is missing', () => {
    // Arrange
    getFromLocalStorage
      .mockReturnValueOnce(null)
      .mockReturnValue('present');

    expect(getSession()).toBe(null);
  });

  // Act/Assert
  it('getCurrentSession rename fields from localStorage names to session names', () => {
    // Arrange
    getFromLocalStorage
      .mockImplementation((key) => {
        const values = {
          access_token: 'expectedAccessToken',
          expires_at: 'expectedExpiresAt',
          id_token: 'expectedIdToken',
        };

        return values[key];
      });

    const output = getSession();
    expect(output.accessToken).toBe('expectedAccessToken');
    expect(output.expiresAt).toBe('expectedExpiresAt');
    expect(output.idToken).toBe('expectedIdToken');
  });
});

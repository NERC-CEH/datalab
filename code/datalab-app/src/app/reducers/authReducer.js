import typeToReducer from 'type-to-reducer';
import { USER_LOGIN } from '../actions/authActions';

const initialState = {
  user: null,
};

export default typeToReducer({
  [USER_LOGIN]: (state, action) => ({ ...initialState, user: processUser(action.payload) }),
}, initialState);

function processUser(authResponse) {
  return {
    accessToken: authResponse.accessToken,
    expiresAt: authResponse.expiresAt,
    idToken: authResponse.idToken,
  };
}

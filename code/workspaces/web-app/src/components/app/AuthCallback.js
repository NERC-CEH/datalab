import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { replace } from 'connected-react-router';
import { useLocation } from 'react-router';
import { getAuth } from '../../config/authConfig';
import authActions from '../../actions/authActions';

export const handleAuth = async (searchUrl, routeTo, dispatch) => {
  if (/verify/.test(searchUrl)) {
    dispatch(routeTo('/verify'));
  } else if (/code|access_token|id_token|error/.test(searchUrl)) {
    try {
      const authResponse = await getAuth().handleAuthentication();
      dispatch(authActions.userLogsIn(authResponse));
      dispatch(routeTo(authResponse.appRedirect));
    } catch (error) {
      // Redirect to home page if auth fails
      dispatch(routeTo('/'));
    }
  } else {
    // Redirect to projects page if no hash is present
    dispatch(routeTo('/projects'));
  }
};

const AuthCallback = () => {
  const dispatch = useDispatch();
  const { search } = useLocation();
  const routeTo = replace;

  useEffect(() => {
    handleAuth(search, routeTo, dispatch);
  }, [routeTo, dispatch, search]);

  return null;
};

export default AuthCallback;

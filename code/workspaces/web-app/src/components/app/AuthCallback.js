import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { replace } from 'connected-react-router';
import getAuth from '../../auth/auth';
import authActions from '../../actions/authActions';
import { useSearchUrl } from '../../hooks/routerHooks';

export const handleAuth = async (searchUrl, routeTo, dispatch) => {
  if (/code|access_token|id_token|error/.test(searchUrl)) {
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
  const searchUrl = useSearchUrl();
  const dispatch = useDispatch();
  const routeTo = replace;

  useEffect(() => {
    handleAuth(searchUrl, routeTo, dispatch);
  }, [searchUrl, routeTo, dispatch]);

  return null;
};

export default AuthCallback;

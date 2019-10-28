import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { replace } from 'connected-react-router';
import getAuth from '../../auth/auth';
import authActions from '../../actions/authActions';
import { useUrlHash } from '../../hooks/routerHooks';

export const handleAuth = async (urlHash, routeTo, dispatch) => {
  if (/access_token|id_token|error/.test(urlHash)) {
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
  const urlHash = useUrlHash();
  const dispatch = useDispatch();
  const routeTo = replace;

  useEffect(() => {
    handleAuth(urlHash, routeTo, dispatch);
  }, [urlHash, routeTo, dispatch]);

  return null;
};

export default AuthCallback;

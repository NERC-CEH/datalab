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
  } else if (/verify/.test(props.location.hash)) {
    dispatch(routeTo('/verify'));
  } else {
    // Redirect to projects page if no hash is present
    dispatch(routeTo('/projects'));
  }
};

const AuthCallback = (props) => {
  const urlHash = useUrlHash();
  const dispatch = useDispatch();
  const routeTo = replace;

  useEffect(() => {
    handleAuth(urlHash, routeTo, dispatch, props);
  }, [urlHash, routeTo, dispatch, props]);

  return null;
};

export default AuthCallback;

import { useLayoutEffect } from 'react';
import getAuth from '../auth/auth';

const RedirectToLoginPage = () => {
  useLayoutEffect(() => {
    getAuth().login();
  }, []);

  return null;
};

export default RedirectToLoginPage;

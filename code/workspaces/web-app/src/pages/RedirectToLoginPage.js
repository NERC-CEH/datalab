import { useLayoutEffect } from 'react';
import { getAuth } from '../config/auth';

const RedirectToLoginPage = () => {
  useLayoutEffect(() => {
    getAuth().login();
  }, []);

  return null;
};

export default RedirectToLoginPage;

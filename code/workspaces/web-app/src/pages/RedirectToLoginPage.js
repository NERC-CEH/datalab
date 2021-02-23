import { useLayoutEffect } from 'react';
import { getAuth } from '../config/authConfig';

const RedirectToLoginPage = () => {
  useLayoutEffect(() => {
    getAuth().login();
  }, []);

  return null;
};

export default RedirectToLoginPage;

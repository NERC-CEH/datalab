import { useEffect } from 'react';

export const effectFn = () => {
  window.parent.postMessage(window.location.hash, '*');
};

const AuthCallback = () => {
  useEffect(effectFn);
  return null; // callback shouldn't render
};

export default AuthCallback;

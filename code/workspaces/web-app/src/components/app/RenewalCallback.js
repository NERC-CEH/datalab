import { useLayoutEffect } from 'react';

export const effectFn = () => {
  window.parent.postMessage(window.location.hash, '*');
};

const AuthCallback = () => {
  // Using useLayoutEffect as useEffect doesn't seem to fire. This could be because
  // the component returns null so never technically renders and useEffect fires after
  // the component renders. useLayoutEffect fires before render and therefore gets called.
  useLayoutEffect(effectFn);
  return null; // callback shouldn't render
};

export default AuthCallback;

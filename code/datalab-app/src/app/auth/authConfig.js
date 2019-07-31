import axios from 'axios';

const getAuthConfig = () => axios
  .get('/web_auth_config.json')
  .then(({ data }) => {
    if (window.location.hostname === 'localhost') {
      return {
        ...data,
        redirectUri: `${window.location.origin}/callback`,
        returnTo: `${window.location.origin}/`,
      };
    }

    return data;
  });

export default getAuthConfig;

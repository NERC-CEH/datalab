import axios from 'axios';

const getAuthConfig = () => axios
  .get('/web_auth_config.json')
  .then(({ data }) => {
    // Overwrite default configuration for running locally/development purposes
    if (window.location.hostname.match(/localhost/)) {
      const localData = data;
      localData.oidc.userManager.silent_redirect_uri = `${window.location.origin}/silent_callback`;
      localData.oidc.userManager.redirect_uri = `${window.location.origin}/callback`;
      return localData;
    }

    return data;
  });

export default getAuthConfig;

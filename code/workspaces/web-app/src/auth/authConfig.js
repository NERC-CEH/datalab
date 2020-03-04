import axios from 'axios';

const getAuthConfig = () => axios
  .get('/web_auth_config.json')
  .then(({ data }) => {
    // Overwrite default configuration for running locally/development purposes
    if (window.location.hostname.match(/localhost/)) {
      return {
        ...data,
        silent_redirect_uri: `${window.location.origin}/silent_callback`,
        redirect_uri: `${window.location.origin}/callback`,
        metadata: {
          ...data.metadata,
          end_session_endpoint: `${data.authority}/v2/logout?returnTo=${encodeURIComponent(window.location.origin)}&client_id=${data.client_id}`,
        },
      };
    }

    return data;
  });

export default getAuthConfig;

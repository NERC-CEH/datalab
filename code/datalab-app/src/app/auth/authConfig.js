import axios from 'axios';

const getAuthConfig = () => axios
  .get('/web_auth_config.json')
  .then(({ data }) => data);

export default getAuthConfig;

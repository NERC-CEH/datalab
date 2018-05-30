import axios from 'axios';
import config from '../config';

const authUsersUrl = `${config.get('authorisationService')}/users`;

function getAll({ token }) {
  return axios.get(authUsersUrl, generateOptions(token))
    .then(response => response.data);
}

const generateOptions = token => ({
  headers: {
    authorization: token,
  },
});

export default { getAll };

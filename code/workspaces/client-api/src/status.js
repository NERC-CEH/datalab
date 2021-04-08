import { version } from './version.json';

function get(req, res) {
  res.json({
    message: 'OK',
    version,
  });
}

export default { get };

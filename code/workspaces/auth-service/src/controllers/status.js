import { version } from '../version.json';

function status(req, res) {
  res.json({ message: 'OK', version });
}

export default { status };

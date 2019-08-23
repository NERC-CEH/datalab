import { version } from '../version';

function status(req, res) {
  res.json({ message: 'OK', version });
}

export default { status };

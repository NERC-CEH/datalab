import version from '../version';

function status(req, res) {
  const versionString = version.versionString || 'Development build';
  res.json({ message: 'OK', versionString });
}

export default { status };

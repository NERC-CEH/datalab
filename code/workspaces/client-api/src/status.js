import version from './version';

function get(req, res) {
  res.json({
    message: 'OK',
    version,
  });
}

export default { get };

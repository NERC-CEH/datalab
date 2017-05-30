import version from './version';

function get(req, res) {
  res.json({
    message: 'I am alive!',
    version,
  });
}

export default { get };

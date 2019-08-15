import database from '../config/database';

function UserRoles() {
  return database.getModel('UserRoles');
}

function getRoles(userId) {
  return new Promise((resolve, reject) => {
    const query = UserRoles().findOne({ userId });
    query.exec((err, document) => {
      if (err) {
        reject(err);
      }
      resolve(document);
    });
  });
}

export default getRoles;

export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGOUT = 'USER_LOGOUT';

const userLogsIn = user => ({ type: USER_LOGIN, payload: user });
const userLogsOut = () => ({ type: USER_LOGOUT });

export default { userLogsIn, userLogsOut };

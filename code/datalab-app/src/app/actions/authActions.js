export const USER_LOGIN = 'USER_LOGIN';

const userLogsIn = user => ({ type: USER_LOGIN, payload: user });

export default { userLogsIn };

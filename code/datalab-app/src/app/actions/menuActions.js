export const MENU_SHOW_ACTION = 'MENU_SHOW';
export const MENU_HIDE_ACTION = 'MENU_HIDE';

export default {
  showMenu: () => ({ type: MENU_SHOW_ACTION }),
  hideMenu: () => ({ type: MENU_HIDE_ACTION }),
};

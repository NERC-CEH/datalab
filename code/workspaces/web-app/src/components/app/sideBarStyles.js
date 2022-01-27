const drawerWidth = 200;

export default function sideBarStyles(theme) {
  return {
    itemList: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: 0,
    },
    sideBar: {
      background: theme.palette.sideBarBackground,
      width: drawerWidth,
      minWidth: drawerWidth,
      borderRight: `1px solid ${theme.palette.divider}`,
      overflow: 'auto',
      padding: `0 ${theme.spacing(2)}`,
    },
  };
}

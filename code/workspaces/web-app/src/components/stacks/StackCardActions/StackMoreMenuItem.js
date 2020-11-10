import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import PermissionWrapper from '../../common/ComponentPermissionWrapper';

// Uses forwardRef to forward ref from menu onto MenuItem as functional components cannot be given refs.
// This stops React logging an error and seems like the right place to forward the ref too as
// this component is a wrapper around the MenuItem.
const StackMoreMenuItem = React.forwardRef((props, ref) => {
  const {
    shouldRender = false, onClick, disabled, userPermissions, requiredPermission,
    tooltipText = '', disableTooltip, children,
  } = props;

  if (!shouldRender) return null;

  return (
    <PermissionWrapper userPermissions={userPermissions} permission={requiredPermission}>
      <Tooltip
        title={tooltipText}
        disableHoverListener={disableTooltip}>
        <div> {/* provides element for tooltip to listen to when menu item is disabled */}
          <MenuItem disabled={disabled} onClick={onClick} ref={ref}>
            {children}
          </MenuItem>
        </div>
      </Tooltip>
    </PermissionWrapper>
  );
});

StackMoreMenuItem.propTypes = {
  shouldRender: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  requiredPermission: PropTypes.string.isRequired,
  tooltipText: PropTypes.string,
  disableTooltip: PropTypes.bool,
  children: PropTypes.node,
};

export default StackMoreMenuItem;

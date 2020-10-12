import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import PermissionWrapper from '../../common/ComponentPermissionWrapper';

const StackMoreMenuItem = ({
  shouldRender = true, onClick, disabled, userPermissions, requiredPermission,
  tooltipText = '', disableTooltip, children,
}) => (
  !shouldRender
    ? null
    : (
      <PermissionWrapper userPermissions={userPermissions} permission={requiredPermission}>
        <Tooltip
         title={tooltipText}
         disableHoverListener={disableTooltip}>
          <div> {/* provides element for tooltip to listed to when menu item is disabled */}
            <MenuItem disabled={disabled} onClick={onClick}>
              {children}
            </MenuItem>
          </div>
        </Tooltip>
      </PermissionWrapper>
    )
);

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

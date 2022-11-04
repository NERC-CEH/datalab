import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';

export const PREVIOUS_PAGE = 'previous';
export const NEXT_PAGE = 'next';

function getTooltipTitle(variant, disabled) {
  if (variant === PREVIOUS_PAGE) {
    return !disabled ? 'Previous page' : 'No previous page';
  }

  if (variant === NEXT_PAGE) {
    return !disabled ? 'Next page' : 'No next page';
  }

  return '';
}

const PaginationControlButton = ({ variant, onClick, disabled = false }) => (
    <Tooltip title={getTooltipTitle(variant, disabled)}>
    <span> {/* need span to make tooltip work when button is disabled */}
      <IconButton
        size="small"
        disabled={disabled}
        onClick={onClick}
      >
        {variant === PREVIOUS_PAGE && <NavigateBeforeRoundedIcon />}
        {variant === NEXT_PAGE && <NavigateNextRoundedIcon />}
      </IconButton>
    </span>
    </Tooltip>
);

PaginationControlButton.propTypes = {
  variant: PropTypes.oneOf([PREVIOUS_PAGE, NEXT_PAGE]).isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default PaginationControlButton;

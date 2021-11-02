import React from 'react';
import PropTypes from 'prop-types';
import PagePrimaryAction from '../common/buttons/PagePrimaryActionButton';

const NewStackButton = ({ onClick, typeName, labelPrefix }) => (
  <PagePrimaryAction aria-label="add" onClick={onClick}>
    {`${labelPrefix || 'Create'} ${typeName}`}
  </PagePrimaryAction>
);

NewStackButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  typeName: PropTypes.string.isRequired,
};

export default NewStackButton;

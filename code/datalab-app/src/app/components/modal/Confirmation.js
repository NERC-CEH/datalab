import React from 'react';
import PropTypes from 'prop-types';
import DatalabModal from './DatalabModal';
import IconButton from '../common/control/IconButton';

const Confirmation = ({ title, body, onSubmit, onCancel }) => (
  <DatalabModal title={title} body={body}>
    <IconButton onClick={onCancel} icon="clear">
      No
    </IconButton>
    <IconButton danger onClick={onSubmit} icon="delete">
      Yes
    </IconButton>
  </DatalabModal>
);

Confirmation.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default Confirmation;

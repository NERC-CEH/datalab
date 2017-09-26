import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import DatalabModal from './DatalabModal';

const Confirmation = ({ title, body, onSubmit, onCancel }) => (
  <DatalabModal title={title} body={body}>
    <Button negative onClick={onCancel}>
      No
    </Button>
    <Button positive icon='checkmark' labelPosition='right' content='Yes' onClick={onSubmit}/>
  </DatalabModal>
);

Confirmation.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default Confirmation;

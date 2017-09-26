import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'semantic-ui-react';

const DatalabModal = ({ title, body, children }) => (
    <Modal size='small' dimmer='blurring' open={true}>
      <Modal.Header>{title}</Modal.Header>
      <Modal.Content>
        <p>{body}</p>
      </Modal.Content>
      <Modal.Actions>{children}</Modal.Actions>
    </Modal>
);

DatalabModal.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string.isRequired,
};

export default DatalabModal;

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

const NotebookButton = ({ notebook, openNotebook }) => (
  <Button primary onClick={() => openNotebook(notebook)} >
    {notebook.displayName}
  </Button>
);

NotebookButton.propTypes = {
  notebook: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  openNotebook: PropTypes.func.isRequired,
};

export default NotebookButton;

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

const NotebookButton = ({ notebook, openNotebookAction }) => (
  <Button primary onClick={() => openNotebookAction(notebook)} >
    {notebook.displayName}
  </Button>
);

NotebookButton.propTypes = {
  notebook: PropTypes.shape({
    name: PropTypes.string,
    url: PropTypes.string,
    token: PropTypes.string,
  }),
  openNotebookAction: PropTypes.func.isRequired,
};

export default NotebookButton;

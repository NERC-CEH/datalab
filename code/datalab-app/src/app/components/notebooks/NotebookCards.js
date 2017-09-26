import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'semantic-ui-react';
import NotebookCard from './NotebookCard';
import CreateNotebookContainer from './CreateNotebookContainer';

const NotebookCards = ({ notebooks, openNotebook, deleteNotebook }) => (
  <Card.Group>
    {notebooks.map((notebook, index) => (
      <NotebookCard key={index} notebook={notebook}
                    openNotebook={openNotebook} deleteNotebook={deleteNotebook} />
    ))}
    <CreateNotebookContainer />
  </Card.Group>
);

NotebookCards.propTypes = {
  notebooks: PropTypes.arrayOf(PropTypes.object).isRequired,
  openNotebook: PropTypes.func.isRequired,
  deleteNotebook: PropTypes.func.isRequired,
};

export default NotebookCards;

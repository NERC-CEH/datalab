import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'semantic-ui-react';
import NotebookCard from './NotebookCard';

const NotebookCards = ({ notebooks, openNotebook }) => (
  <Card.Group>
    {notebooks.map((notebook, index) => (
      <NotebookCard key={index} notebook={notebook} openNotebook={openNotebook} />
    ))}
  </Card.Group>
);

NotebookCards.propTypes = {
  notebooks: PropTypes.arrayOf(PropTypes.object).isRequired,
  openNotebook: PropTypes.func.isRequired,
};

export default NotebookCards;

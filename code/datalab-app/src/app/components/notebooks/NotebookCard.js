import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Image, Icon } from 'semantic-ui-react';
import notebookDescriptions from './notebookDescriptions';

const NotebookCard = ({ notebook, openNotebook }) =>
  <Card>
    <Card.Content>
      {getImage(notebook)}
      <Card.Header>
        {getDisplayName(notebook)}
      </Card.Header>
      <Card.Meta>
        {getNotebookType(notebook)}
      </Card.Meta>
      <Card.Description>
        {getDescription(notebook)}
      </Card.Description>
    </Card.Content>
    <Card.Content extra>
      <Button primary fluid disabled={!openNotebook} onClick={() => openNotebook(notebook.id)}>
        Open
      </Button>
    </Card.Content>
  </Card>;

NotebookCard.propTypes = {
  notebook: PropTypes.shape({
    id: PropTypes.string,
    displayName: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
  openNotebook: PropTypes.func,
};

function getDisplayName(notebook) {
  return notebook.displayName || 'Display Name';
}

function getImage(notebook) {
  if (notebook.type && notebookDescriptions[notebook.type]) {
    const logo = notebookDescriptions[notebook.type].logo;
    return <Image floated='right' size='tiny' src={logo}/>;
  }

  const style = { float: 'right' };
  return <Icon style={style} size='big' name='question circle' />;
}

function getDescription(notebook) {
  if (notebook.description) {
    return notebook.description;
  } else if (notebookDescriptions[notebook.type]) {
    return notebookDescriptions[notebook.type].description;
  }
  return 'A description of the notebook purpose';
}

function getNotebookType(notebook) {
  return notebook.type ? capitalizeString(notebook.type) : 'Notebook type';
}

function capitalizeString(text) {
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
}

export default NotebookCard;

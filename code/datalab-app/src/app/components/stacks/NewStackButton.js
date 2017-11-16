import React from 'react';
import PropTypes from 'prop-types';
import Card from 'material-ui/Card';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import Tooltip from 'material-ui/Tooltip';

const NewStackButton = ({ onClick, typeName }) =>
  <Card style={{ height: '100%', backgroundColor: 'transparent' }} elevation={0}>
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
      <Tooltip style={{ fontSize: 'larger' }} title={`Create ${typeName}`}>
        <Button style={{ margin: 20 }} fab color="primary" aria-label="add" onClick={onClick}>
          <Icon style={{ fontSize: 40 }} children="add" />
        </Button>
      </Tooltip>
    </div>
  </Card>;

NewStackButton.propTypes = {
  onClick: PropTypes.func,
  typeName: PropTypes.string.isRequired,
};

export default NewStackButton;

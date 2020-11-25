import React from 'react';
import { TYPE_NAME, TYPE_NAME_PLURAL } from '../notebooks/NotebooksContainer';
import ResourceStackCards from './ResourceStackCards';

function Notebooks({ notebooks }) {
  return (
    <ResourceStackCards resources={notebooks} typeName={TYPE_NAME} typeNamePlural={TYPE_NAME_PLURAL} />
  );
}

export default Notebooks;

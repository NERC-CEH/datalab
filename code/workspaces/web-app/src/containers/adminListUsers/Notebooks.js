import React from 'react';
import { NOTEBOOK_TYPE_NAME, NOTEBOOK_TYPE_NAME_PLURAL } from '../notebooks/notebookTypeName';
import ResourceStackCards from './ResourceStackCards';

function Notebooks({ notebooks }) {
  return (
    <ResourceStackCards resources={notebooks} typeName={NOTEBOOK_TYPE_NAME} typeNamePlural={NOTEBOOK_TYPE_NAME_PLURAL} />
  );
}

export default Notebooks;

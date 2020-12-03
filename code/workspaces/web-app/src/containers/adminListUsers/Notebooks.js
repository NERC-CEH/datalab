import React from 'react';
import { TYPE_NAME_PLURAL } from '../notebooks/NotebooksContainer';
import { NOTEBOOK_TYPE_NAME } from '../notebooks/notebookTypeName';
import ResourceStackCards from './ResourceStackCards';

function Notebooks({ notebooks }) {
  return (
    <ResourceStackCards resources={notebooks} typeName={NOTEBOOK_TYPE_NAME} typeNamePlural={TYPE_NAME_PLURAL} />
  );
}

export default Notebooks;

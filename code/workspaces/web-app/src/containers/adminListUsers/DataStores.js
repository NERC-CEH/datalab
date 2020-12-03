import React from 'react';
import ResourceStackCards from './ResourceStackCards';
import { STORAGE_TYPE_NAME, STORAGE_TYPE_NAME_PLURAL } from '../dataStorage/storageTypeName';

function DataStores({ dataStores }) {
  return (
    <ResourceStackCards resources={dataStores} typeName={STORAGE_TYPE_NAME} typeNamePlural={STORAGE_TYPE_NAME_PLURAL} />
  );
}

export default DataStores;

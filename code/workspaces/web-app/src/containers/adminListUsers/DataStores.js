import React from 'react';
import { TYPE_NAME_PLURAL } from '../dataStorage/DataStorageContainer';
import ResourceStackCards from './ResourceStackCards';
import { STORAGE_TYPE_NAME } from '../dataStorage/storageTypeName';

function DataStores({ dataStores }) {
  return (
    <ResourceStackCards resources={dataStores} typeName={STORAGE_TYPE_NAME} typeNamePlural={TYPE_NAME_PLURAL} />
  );
}

export default DataStores;

import React from 'react';
import { TYPE_NAME, TYPE_NAME_PLURAL } from '../dataStorage/DataStorageContainer';
import ResourceStackCards from './ResourceStackCards';

function DataStores({ dataStores }) {
  return (
    <ResourceStackCards resources={dataStores} typeName={TYPE_NAME} typeNamePlural={TYPE_NAME_PLURAL} />
  );
}

export default DataStores;

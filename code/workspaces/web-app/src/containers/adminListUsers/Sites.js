import React from 'react';
import { TYPE_NAME, TYPE_NAME_PLURAL } from '../sites/SitesContainer';
import ResourceStackCards from './ResourceStackCards';

function Sites({ sites }) {
  return (
    <ResourceStackCards resources={sites} typeName={TYPE_NAME} typeNamePlural={TYPE_NAME_PLURAL} />
  );
}

export default Sites;

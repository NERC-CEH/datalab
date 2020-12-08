import React from 'react';
import ResourceStackCards from './ResourceStackCards';
import { SITE_TYPE_NAME, SITE_TYPE_NAME_PLURAL } from '../sites/siteTypeName';

function Sites({ sites }) {
  return (
    <ResourceStackCards resources={sites} typeName={SITE_TYPE_NAME} typeNamePlural={SITE_TYPE_NAME_PLURAL} />
  );
}

export default Sites;

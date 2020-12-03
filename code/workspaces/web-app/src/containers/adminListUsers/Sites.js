import React from 'react';
import { TYPE_NAME_PLURAL } from '../sites/SitesContainer';
import ResourceStackCards from './ResourceStackCards';
import { SITE_TYPE_NAME } from '../sites/siteTypeName';

function Sites({ sites }) {
  return (
    <ResourceStackCards resources={sites} typeName={SITE_TYPE_NAME} typeNamePlural={TYPE_NAME_PLURAL} />
  );
}

export default Sites;

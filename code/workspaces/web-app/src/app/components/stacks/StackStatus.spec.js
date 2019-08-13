import { createShallow } from '@material-ui/core/test-utils';
import React from 'react';
import { statusTypes } from 'common';
import StackStatus from './StackStatus';

const { getStatusKeys } = statusTypes;

describe('StackStatus', () => {
  function shallowRender(status) {
    const shallow = createShallow({ dive: true });

    return shallow(<StackStatus status={status} />);
  }

  it('creates correct snapshot for status types', () =>
    getStatusKeys().forEach(status =>
      expect(shallowRender(status)).toMatchSnapshot()));
});

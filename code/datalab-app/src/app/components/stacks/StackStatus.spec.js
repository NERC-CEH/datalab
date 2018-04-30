import React from 'react';
import { createShallow } from 'material-ui/test-utils';
import { getStatusKeys } from '../../../shared/statusTypes';
import StackStatus from './StackStatus';

describe('StackStatus', () => {
  function shallowRender(status) {
    const shallow = createShallow({ dive: true });

    return shallow(<StackStatus status={status} />);
  }

  it('creates correct snapshot for status types', () =>
    getStatusKeys().forEach(status =>
      expect(shallowRender(status)).toMatchSnapshot()));
});

import React from 'react';
import { statusTypes } from 'common';
import { render } from '../../testUtils/renderTests';
import StackStatus from './StackStatus';

const { getStatusKeys } = statusTypes;

describe('StackStatus', () => {
  it('creates correct snapshot for status types',
    () => getStatusKeys().forEach(status => expect(render(<StackStatus status={status} />).container).toMatchSnapshot()));
});

import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import SettingsPage from './SettingsPage';

const userPermissions = ['project:settings:list'];

describe('SettingsPage', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  it('renders to match snapshot', () => {
    expect(
      shallow(<SettingsPage userPermissions={userPermissions}/>),
    ).toMatchSnapshot();
  });
});

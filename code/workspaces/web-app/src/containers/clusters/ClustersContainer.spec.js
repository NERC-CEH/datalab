import React from 'react';
import { render } from '../../testUtils/renderTests';
import ClustersContainer from './ClustersContainer';

import * as mockAuthHooks from '../../hooks/authHooks';
import * as mockCurrentProjectHooks from '../../hooks/currentProjectHooks';

jest.mock('./ProjectClustersContainer', () => props => (<>ProjectClustersContainer Mock {JSON.stringify(props)}</>));
jest.mock('../../hooks/authHooks');
jest.mock('../../hooks/currentProjectHooks');

const copyMock = {
  Python: () => {},
};

beforeEach(() => {
  mockAuthHooks.useCurrentUserPermissions.mockReturnValue({ value: ['expectedPermission'] });
  mockCurrentProjectHooks.useCurrentProjectKey.mockReturnValue({ value: 'current-project' });
});

describe('ClustersContainer', () => {
  it('renders correct snapshot', () => {
    expect(render(<ClustersContainer clusterType="DASK" copySnippets={copyMock}/>).container).toMatchSnapshot();
  });
});

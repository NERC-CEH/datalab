import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { permissionTypes } from 'common';
import { render } from '../../testUtils/renderTests';
import AssetRepoNavigationContainer from './AssetRepoNavigationContainer';
import { useCurrentUserPermissions } from '../../hooks/authHooks';

jest.mock('../../pages/AssetRepoAddMetadataPage', () => () => (<>AssetRepoAddMetadataPage Mock</>));
jest.mock('../../pages/AssetRepoFindPage', () => () => (<>AssetRepoFindPage Mock</>));

jest.mock('../../components/app/Footer', () => () => (<div>Footer mock</div>));

jest.mock('../../hooks/authHooks');

describe('AssetRepoNavigationContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useCurrentUserPermissions.mockReturnValue({ value: [permissionTypes.SYSTEM_INSTANCE_ADMIN] });
  });

  const renderWithHistory = path => render(
    <MemoryRouter initialEntries={[path]} >
      <AssetRepoNavigationContainer />
    </MemoryRouter>,
  );

  it('renders to match snapshot passing correct props to children', () => {
    const wrapper = renderWithHistory('/foo/bar');
    expect(wrapper.container).toMatchSnapshot();

    expect(wrapper.queryByText('404 – Page Not Found')).not.toBeNull();
  });

  it('renders correctly for the assets add metadata route', () => {
    const wrapper = renderWithHistory('/assets/add-metadata');

    expect(wrapper.queryByText('AssetRepoAddMetadataPage Mock')).not.toBeNull();
    expect(wrapper.queryByText('AssetRepoFindPage Mock')).toBeNull();
  });

  it('renders correctly for the assets find route', () => {
    const wrapper = renderWithHistory('/assets/find');

    expect(wrapper.queryByText('AssetRepoAddMetadataPage Mock')).toBeNull();
    expect(wrapper.queryByText('AssetRepoFindPage Mock')).not.toBeNull();
  });
});

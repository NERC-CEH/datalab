import React from 'react';
import { render } from '../testUtils/renderTests';
import AddAssetsToNotebookPage from './AddAssetsToNotebookPage';
import * as container from '../containers/assetRepo/AddAssetsToNotebookContainer';

const userPermissions = ['expectedPermission'];

describe('AddAssetsToNotebookPage', () => {
  beforeEach(() => {
    jest.mock('../containers/assetRepo/AddAssetsToNotebookContainer');
    container.AddAssetsToNotebookContainer = jest.fn(props => (
      <div>{`AddAssetsToNotebookContainer: ${JSON.stringify(props)}`}</div>
    ));
  });

  it('renders correctly', () => {
    const wrapper = render(<AddAssetsToNotebookPage userPermissions={userPermissions}/>);
    expect(wrapper.container).toMatchSnapshot();
  });
});

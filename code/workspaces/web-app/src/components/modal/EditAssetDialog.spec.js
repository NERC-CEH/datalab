import React from 'react';
import { render } from '@testing-library/react';
import EditAssetDialog from './EditAssetDialog';

describe('EditAssetDialog', () => {
  const mockAsset = {
    name: 'name',
    version: 'version',
    fileLocation: 'fileLocation',
    owners: [],
    projects: [],
    visible: 'PUBLIC',
  };

  const onSubmit = jest.fn().mockName('onSubmit');
  const onCancel = jest.fn().mockName('onCancel');

  const generateProps = () => ({
    title: 'Title',
    onSubmit,
    onCancel,
    asset: mockAsset,
    editPermissions: {},
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly passing values to provided from component', () => {
    const FormComponent = props => (<div>{`Form: ${JSON.stringify(props)}`}</div>);
    const props = generateProps();
    props.formComponent = FormComponent;

    const wrapper = render(<EditAssetDialog {...props}/>);

    // Use baseElement instead of container as it's a Modal Dialog.
    expect(wrapper.baseElement).toMatchSnapshot();
  });
});

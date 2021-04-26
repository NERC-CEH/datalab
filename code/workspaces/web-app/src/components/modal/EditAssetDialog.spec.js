import React from 'react';
import { shallow } from 'enzyme';
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

  const shallowRender = ({
    title = 'Title',
    onSubmit = jest.fn().mockName('onSubmit'),
    onCancel = jest.fn().mockName('onCancel'),
    asset = mockAsset,
    formComponent,
  }) => shallow(
    <EditAssetDialog {...{ title, onSubmit, onCancel, asset, formComponent }} />,
  );

  it('renders correctly passing values to provided from component', () => {
    const FormComponent = () => <div />;
    expect(shallowRender({ formComponent: FormComponent })).toMatchSnapshot();
  });
});

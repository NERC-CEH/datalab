import React from 'react';
import { render } from '../../testUtils/renderTests';
import { PureCreateSiteForm } from './CreateSiteForm';

jest.mock('redux-form', () => ({
  reduxForm: jest.fn(() => jest.fn()),
  Field: props => (<div>{`Field: ${JSON.stringify(props)}`}</div>),
}));
jest.mock('../common/form/controls', () => ({
  CreateFormControls: ({ submitting }) => (<div>{`Controls: submitting - ${submitting}`}</div>),
}));

describe('CreateSiteForm', () => {
  const onSubmitMock = jest.fn().mockName('onSubmit');
  const onCancelMock = jest.fn().mockName('onCancel');
  const submitting = false;

  const generateProps = ({ versionOptions = [] } = {}, fileField = false, condaField = false) => ({
    onSubmit: onSubmitMock,
    cancel: onCancelMock,
    submitting,
    projectKey: 'testproj',
    dataStorageOptions: [{ text: 'nfs', value: '5' }],
    typeOptions: [{ text: 'RStudio', value: 'RSTUDIO' }],
    versionOptions,
    fileField,
    condaField,
  });

  it('creates correct snapshot for create Site Form when all optional fields are enabled', () => {
    // Arrange
    const versionOptions = [{ text: '0.1.0', value: '0.1.0' }];
    const props = generateProps({ versionOptions }, true, true);

    // Act
    const wrapper = render(<PureCreateSiteForm {...props}/>);

    // Assert
    expect(wrapper.container).toMatchSnapshot();
    expect(wrapper.queryAllByText('Field', { exact: false })).toHaveLength(11);
  });

  it('creates correct snapshot for create Site Form when no optional fields are enabled', () => {
    // Arrange
    const props = generateProps();

    // Act
    const wrapper = render(<PureCreateSiteForm {...props}/>);

    // Assert
    expect(wrapper.container).toMatchSnapshot();
    expect(wrapper.queryAllByText('Field', { exact: false })).toHaveLength(8);
  });

  it('creates correct fields for create Site Form when there are version options', () => {
    // Arrange
    const versionOptions = [{ text: '0.1.0', value: '0.1.0' }];
    const props = generateProps({ versionOptions });

    // Act
    const wrapper = render(<PureCreateSiteForm {...props}/>);

    // Assert
    expect(wrapper.queryAllByText('Field', { exact: false })).toHaveLength(9);
    expect(wrapper.queryAllByText(/Field: .*"name":"version"/, { exact: false })).toHaveLength(1);
    expect(wrapper.queryAllByText(/Field: .*"name":"filename"/, { exact: false })).toHaveLength(0);
    expect(wrapper.queryAllByText(/Field: .*"name":"condaPath"/, { exact: false })).toHaveLength(0);
  });

  it('creates correct fields for create Site Form when user can enter filename and condaPath', () => {
    // Arrange
    const props = generateProps({}, true, true);

    // Act
    const wrapper = render(<PureCreateSiteForm {...props}/>);

    // Assert
    expect(wrapper.queryAllByText('Field', { exact: false })).toHaveLength(10);
    expect(wrapper.queryAllByText(/Field: .*"name":"version"/, { exact: false })).toHaveLength(0);
    expect(wrapper.queryAllByText(/Field: .*"name":"filename"/, { exact: false })).toHaveLength(1);
    expect(wrapper.queryAllByText(/Field: .*"name":"condaPath"/, { exact: false })).toHaveLength(1);
  });
});

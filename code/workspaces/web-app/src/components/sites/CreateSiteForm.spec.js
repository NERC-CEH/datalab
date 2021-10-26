import React from 'react';
import * as form from 'redux-form';
import { render } from '@testing-library/react';
import * as controls from '../common/form/controls';
import { PureCreateSiteForm } from './CreateSiteForm';

jest.mock('redux-form', () => ({
  reduxForm: jest.fn(() => jest.fn()),
  Field: jest.fn(props => (<div>{JSON.stringify(props)}</div>)),
}));
jest.mock('../common/form/controls', () => ({
  CreateFormControls: jest.fn(() => (<div>Controls</div>)),
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

  beforeEach(() => jest.clearAllMocks());

  const expectField = (name, called) => {
    if (called) {
      expect(form.Field).toHaveBeenCalledWith(expect.objectContaining({ name }), {});
    } else {
      expect(form.Field).not.toHaveBeenCalledWith(expect.objectContaining({ name }), {});
    }
  };

  it('creates correct snapshot for create Site Form when all optional fields are enabled', () => {
    // Arrange
    const versionOptions = [{ text: '0.1.0', value: '0.1.0' }];
    const props = generateProps({ versionOptions }, true, true);

    // Act
    const wrapper = render(<PureCreateSiteForm {...props}/>);

    // Assert
    expect(wrapper.container).toMatchSnapshot();
    expect(form.Field).toHaveBeenCalledTimes(11);
    expect(controls.CreateFormControls).toHaveBeenCalledWith({ onCancel: onCancelMock, submitting }, {});
  });

  it('creates correct snapshot for create Site Form when no optional fields are enabled', () => {
    // Arrange
    const props = generateProps();

    // Act
    const wrapper = render(<PureCreateSiteForm {...props}/>);

    // Assert
    expect(wrapper.container).toMatchSnapshot();
    expect(form.Field).toHaveBeenCalledTimes(8);
    expect(controls.CreateFormControls).toHaveBeenCalledWith({ onCancel: onCancelMock, submitting }, {});
  });

  it('creates correct fields for create Site Form when there are version options', () => {
    // Arrange
    const versionOptions = [{ text: '0.1.0', value: '0.1.0' }];
    const props = generateProps({ versionOptions });

    // Act
    render(<PureCreateSiteForm {...props}/>);

    // Assert
    expect(form.Field).toHaveBeenCalledTimes(9);
    expectField('version', true);
    expectField('filename', false);
    expectField('condaPath', false);
  });

  it('creates correct fields for create Site Form when user can enter filename and condaPath', () => {
    // Arrange
    const props = generateProps({}, true, true);

    // Act
    render(<PureCreateSiteForm {...props}/>);

    // Assert
    expect(form.Field).toHaveBeenCalledTimes(10);
    expectField('version', false);
    expectField('filename', true);
    expectField('condaPath', true);
  });
});

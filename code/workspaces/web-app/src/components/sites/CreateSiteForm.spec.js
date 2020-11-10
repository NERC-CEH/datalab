import React from 'react';
import { shallow } from 'enzyme';
import { PureCreateSiteForm } from './CreateSiteForm';

describe('CreateSiteForm', () => {
  function shallowRender(props) {
    return shallow(<PureCreateSiteForm {...props} />);
  }

  const onSubmitMock = jest.fn().mockName('onSubmit');
  const onCancelMock = jest.fn().mockName('onCancel');

  const generateProps = ({ versionOptions = [] } = {}) => ({
    onSubmit: onSubmitMock,
    cancel: onCancelMock,
    projectKey: 'testproj',
    dataStorageOptions: [{ text: 'nfs', value: '5' }],
    typeOptions: [{ text: 'RStudio', value: 'RSTUDIO' }],
    versionOptions,
  });

  beforeEach(() => jest.resetAllMocks());

  it('creates correct snapshot for create Site Form when there are version options', () => {
    // Arrange
    const versionOptions = [{ text: '0.1.0', value: '0.1.0' }];
    const props = generateProps({ versionOptions });

    // Act
    const output = shallowRender(props);

    // Assert
    expect(output).toMatchSnapshot();
  });

  it('creates correct snapshot for create Site Form when there are no version options', () => {
    // Arrange
    const props = generateProps();

    // Act
    const output = shallowRender(props);

    // Assert
    expect(output).toMatchSnapshot();
  });
});

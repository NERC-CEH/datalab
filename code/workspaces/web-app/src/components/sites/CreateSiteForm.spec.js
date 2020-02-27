import React from 'react';
import { shallow } from 'enzyme';
import { PureCreateSiteForm } from './CreateSiteForm';

describe('CreateSiteForm', () => {
  function shallowRender(props) {
    return shallow(<PureCreateSiteForm {...props} />);
  }

  const onSubmitMock = jest.fn();
  const onCancelMock = jest.fn();

  const generateProps = () => ({
    onSubmit: onSubmitMock,
    cancel: onCancelMock,
    projectKey: 'testproj',
    dataStorageOptions: [{ text: 'nfs', value: '5' }],
  });

  beforeEach(() => jest.resetAllMocks());

  it('creates correct snapshot for create Site Form', () => {
    // Arrange
    const props = generateProps();

    // Act
    const output = shallowRender(props);

    // Assert
    expect(output).toMatchSnapshot();
  });
});

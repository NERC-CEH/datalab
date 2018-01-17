import React from 'react';
import { shallow } from 'enzyme';
import Confirmation from './Confirmation';

function shallowRender(props) {
  return shallow(<Confirmation {...props} />);
}

describe('Confirmation', () => {
  const onSubmitMock = jest.fn();
  const onCancelMock = jest.fn();

  const generateProps = () => ({
    title: 'Title',
    body: 'Body',
    onSubmit: onSubmitMock,
    onCancel: onCancelMock,
  });

  beforeEach(() => jest.resetAllMocks());

  it('creates correct snapshot for confirmation dialog', () => {
    // Arrange
    const props = generateProps();

    // Act
    const output = shallowRender(props);

    // Assert
    expect(output).toMatchSnapshot();
  });

  it('wires up cancel function correctly', () => {
    // Arrange
    const props = generateProps();

    // Act
    const output = shallowRender(props);
    const cancelFunction = output.childAt(0).prop('onClick');
    cancelFunction();

    // Assert
    expect(onCancelMock).toHaveBeenCalled();
  });

  it('wires up submit function correctly', () => {
    // Arrange
    const props = generateProps();

    // Act
    const output = shallowRender(props);
    const submitFunction = output.childAt(1).prop('onClick');
    submitFunction();

    // Assert
    expect(onSubmitMock).toHaveBeenCalled();
  });
});

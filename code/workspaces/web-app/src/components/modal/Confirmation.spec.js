import React from 'react';
import { shallow } from 'enzyme';
import Confirmation from './Confirmation';
import IconButton from '../common/control/IconButton';

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
    const buttons = output.find(IconButton);
    const cancelFunction = buttons.find({ children: 'Cancel' }).prop('onClick');
    cancelFunction();

    // Assert
    expect(onCancelMock).toHaveBeenCalled();
  });

  it('wires up submit function correctly', () => {
    // Arrange
    const props = generateProps();

    // Act
    const output = shallowRender(props);
    const buttons = output.find(IconButton);
    const submitFunction = buttons.find({ children: 'Confirm Deletion' }).prop('onClick');
    submitFunction();

    // Assert
    expect(onSubmitMock).toHaveBeenCalled();
  });
});

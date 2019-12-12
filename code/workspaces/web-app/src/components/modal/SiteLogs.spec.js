import React from 'react';
import { shallow } from 'enzyme';
import Logs from './SiteLogs';
import PrimaryActionButton from '../common/buttons/PrimaryActionButton';

function shallowRender(props) {
  return shallow(<Logs {...props} />);
}

describe('Logs', () => {
  const onCancelMock = jest.fn();

  const generateProps = () => ({
    title: 'Title',
    body: 'Body',
    onCancel: onCancelMock,
  });

  beforeEach(() => jest.resetAllMocks());

  it('creates correct snapshot for logs dialog', () => {
    // Arrange
    const props = generateProps();

    // Act
    const output = shallowRender(props);

    // Assert
    expect(output).toMatchSnapshot();
  });

  it('wires up close function correctly', () => {
    // Arrange
    const props = generateProps();

    // Act
    const output = shallowRender(props);
    const buttons = output.find(PrimaryActionButton);
    const cancelFunction = buttons.find({ children: 'Close' }).prop('onClick');
    cancelFunction();

    // Assert
    expect(onCancelMock).toHaveBeenCalled();
  });
});

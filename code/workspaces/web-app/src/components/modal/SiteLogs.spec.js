import React from 'react';
import { shallow } from 'enzyme';
import Logs from './SiteLogs';
import IconButton from '../common/control/IconButton';

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
});

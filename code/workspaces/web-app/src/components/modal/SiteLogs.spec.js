import React from 'react';
import { shallow } from 'enzyme';
import Logs from './SiteLogs';
import PrimaryActionButton from '../common/buttons/PrimaryActionButton';

function shallowRender(props) {
  return shallow(<Logs {...props} />);
}

describe('Logs', () => {
  const onCancelMock = jest.fn();
  const getLogsMock = jest.fn();

  getLogsMock.mockReturnValue(Promise.resolve({ value: 'Example Logs' }));
  const generateProps = () => ({
    title: 'Title',
    body: 'Body',
    onCancel: onCancelMock,
    getLogs: getLogsMock,
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
    output.find(PrimaryActionButton).simulate('click');

    // Assert
    expect(onCancelMock).toHaveBeenCalled();
  });
});

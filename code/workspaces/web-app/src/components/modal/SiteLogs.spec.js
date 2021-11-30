import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Logs from './SiteLogs';

function shallowRender(props) {
  return render(<Logs {...props} />);
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
    shallowRender(props);

    // Assert
    expect(screen.getByRole('dialog')).toMatchSnapshot();
  });

  it('wires up close function correctly', () => {
    // Arrange
    const props = generateProps();

    // Act
    shallowRender(props);
    fireEvent.click(screen.getByText('Close'));

    // Assert
    expect(onCancelMock).toHaveBeenCalled();
  });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RobustConfirmation from './RobustConfirmation';

function shallowRender(props) {
  return render(<RobustConfirmation {...props} />).container;
}

describe('Robust Confirmation', () => {
  const onSubmitMock = jest.fn();
  const onCancelMock = jest.fn();

  const generateProps = () => ({
    title: 'Title',
    body: 'Body',
    confirmField: {
      label: 'FieldLabel',
      expectedValue: 'alpha',
    },
    onSubmit: onSubmitMock,
    onCancel: onCancelMock,
  });

  beforeEach(() => jest.resetAllMocks());

  it('creates correct snapshot for confirmation dialog', () => {
    // Arrange
    const props = generateProps();

    // Act
    shallowRender(props);

    // Assert
    expect(screen.getByRole('dialog')).toMatchSnapshot();
  });

  it('wires up cancel function correctly', () => {
    // Arrange
    const props = generateProps();

    // Act
    shallowRender(props);
    fireEvent.click(screen.getByText('Cancel'));

    // Assert
    expect(onCancelMock).toHaveBeenCalled();
  });

  it('wires up submit function correctly', () => {
    // Arrange
    const props = generateProps();

    // Act
    shallowRender(props);
    fireEvent.change(screen.getByRole('dialog').querySelector('[id="name"]'), { target: { value: 'alpha' } });
    fireEvent.click(screen.getByText('Delete'));

    // Assert
    expect(onSubmitMock).toHaveBeenCalled();
  });

  it('submit button is enable when TextField contains expected value', () => {
    // Arrange
    const props = generateProps();

    // Act
    shallowRender(props);
    expect(screen.getByText('Delete').closest('button').getAttribute('disabled')).not.toBeNull();

    fireEvent.change(screen.getByRole('dialog').querySelector('[id="name"]'), { target: { value: 'alpha' } });
    expect(screen.getByText('Delete').closest('button').getAttribute('disabled')).toBeNull();
  });
});

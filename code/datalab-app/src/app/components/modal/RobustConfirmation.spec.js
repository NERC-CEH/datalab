import React from 'react';
import { shallow } from 'enzyme';
import TextField from 'material-ui/TextField';
import RobustConfirmation from './RobustConfirmation';
import IconButton from '../common/control/IconButton';

function shallowRender(props) {
  return shallow(<RobustConfirmation {...props} />);
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

  it('submit button is enable when given the expected value', () => {
    // Arrange
    const props = generateProps();

    // Act
    const output = shallowRender(props);
    const textOnChange = output.find(TextField).prop('onChange');

    // Assert
    // Due to changing state the same node need to bes used in this for the expect checks.
    expect(output.find(IconButton).find({ children: 'Confirm Deletion' }).prop('disabled')).toBe(true);
    textOnChange({ target: { value: 'alpha' } });
    expect(output.find(IconButton).find({ children: 'Confirm Deletion' }).prop('disabled')).toBe(false);
  });
});

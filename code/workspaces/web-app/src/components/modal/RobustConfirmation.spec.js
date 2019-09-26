import React from 'react';
import { shallow } from 'enzyme';
import TextField from '@material-ui/core/TextField';
import RobustConfirmation from './RobustConfirmation';
import SecondaryActionButton from '../common/buttons/SecondaryActionButton';
import DangerButton from '../common/buttons/DangerButton';

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
    const buttons = output.find(SecondaryActionButton);
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
    const buttons = output.find(DangerButton);
    const submitFunction = buttons.find({ children: 'Delete' }).prop('onClick');
    submitFunction();

    // Assert
    expect(onSubmitMock).toHaveBeenCalled();
  });

  it('submit button is enable when TextField contains expected value', () => {
    // Arrange
    const props = generateProps();

    // Act
    const output = shallowRender(props);
    const textOnChange = output.find(TextField).prop('onChange');

    // Assert
    // Due to changes state, for this test, the same node need to be used for the expect checks.
    expect(output.find(DangerButton).find({ children: 'Delete' }).prop('disabled')).toBe(true);
    textOnChange({ target: { value: 'alpha' } });
    expect(output.find(DangerButton).find({ children: 'Delete' }).prop('disabled')).toBe(false);
  });
});

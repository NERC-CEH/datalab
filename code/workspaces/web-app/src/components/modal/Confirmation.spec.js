import React from 'react';
import { render, screen, fireEvent } from '../../testUtils/renderTests';
import Confirmation from './Confirmation';

function shallowRender(props) {
  return render(<Confirmation {...props} />).container;
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
    const props = generateProps();

    shallowRender(props);

    expect(screen.getByRole('dialog')).toMatchSnapshot();
  });

  it('creates correct snapshot for confirmation dialog with array in body', () => {
    const props = {
      ...generateProps(),
      body: ['Body', 'Next line', 'Final line'],
    };

    shallowRender(props);

    expect(screen.getByRole('dialog')).toMatchSnapshot();
  });

  it('wires up cancel function correctly', () => {
    const props = generateProps();

    shallowRender(props);
    fireEvent.click(screen.getByText('Cancel'));

    expect(onCancelMock).toHaveBeenCalled();
  });

  it('wires up submit function correctly', () => {
    const props = generateProps();

    shallowRender(props);
    fireEvent.click(screen.getByText('Confirm Deletion'));

    expect(onSubmitMock).toHaveBeenCalled();
  });
});

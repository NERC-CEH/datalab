import React from 'react';
import { render, fireEvent, screen, within } from '../../testUtils/renderTests';
import EditSiteDialog from './EditSiteDialog';

describe('EditSiteDialog', () => {
  const shallowRender = ({
    title = 'Title',
    onSubmit = jest.fn().mockName('onSubmit'),
    onCancel = jest.fn().mockName('onCancel'),
    stack = { name: 'stackname', displayName: 'Display Name', description: 'description' },
    formComponent,
  }) => render(
    <EditSiteDialog {...{ title, onSubmit, onCancel, stack, formComponent }} />,
  );

  it('renders correctly passing values to provided from component', () => {
    const FormComponent = () => <div />;
    shallowRender({ formComponent: FormComponent });
    expect(screen.getByRole('dialog')).toMatchSnapshot();
  });
});

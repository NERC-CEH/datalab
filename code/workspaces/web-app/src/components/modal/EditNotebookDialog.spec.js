import React from 'react';
import { render, screen } from '@testing-library/react';
import EditNotebookDialog from './EditNotebookDialog';

describe('EditNotebookDialog', () => {
  const shallowRender = ({
    title = 'Title',
    onSubmit = jest.fn().mockName('onSubmit'),
    onCancel = jest.fn().mockName('onCancel'),
    stack = { name: 'stack name', displayName: 'Display Name', description: 'description', assets: [] },
    formComponent,
  }) => render(
    <EditNotebookDialog {...{ title, onSubmit, onCancel, stack, formComponent }} />,
  );

  it('renders correctly passing values to provided from component', () => {
    const FormComponent = () => <div />;
    shallowRender({ formComponent: FormComponent });
    expect(screen.getByRole('dialog')).toMatchSnapshot();
  });
});

import React from 'react';
import { shallow } from 'enzyme';
import EditNotebookDialog from './EditNotebookDialog';

describe('EditNotebookDialog', () => {
  const shallowRender = ({
    title = 'Title',
    onSubmit = jest.fn().mockName('onSubmit'),
    onCancel = jest.fn().mockName('onCancel'),
    stack = { name: 'stack name', displayName: 'Display Name', description: 'description' },
    formComponent,
  }) => shallow(
    <EditNotebookDialog {...{ title, onSubmit, onCancel, stack, formComponent }} />,
  );

  it('renders correctly passing values to provided from component', () => {
    const FormComponent = () => <div />;
    expect(shallowRender({ formComponent: FormComponent })).toMatchSnapshot();
  });
});

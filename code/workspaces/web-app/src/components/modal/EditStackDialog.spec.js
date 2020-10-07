import React from 'react';
import { shallow } from 'enzyme';
import EditStackDialog from './EditStackDialog';

describe('EditStackDialog', () => {
  const shallowRender = ({
    title = 'Title',
    onSubmit = jest.fn().mockName('onSubmit'),
    onCancel = jest.fn().mockName('onCancel'),
    stack = { name: 'stackname', displayName: 'Display Name', description: 'description' },
    formComponent,
  }) => shallow(
    <EditStackDialog {...{ title, onSubmit, onCancel, stack, formComponent }} />,
  );

  it('renders correctly passing values to provided from component', () => {
    const FormComponent = () => <div />;
    expect(shallowRender({ formComponent: FormComponent })).toMatchSnapshot();
  });
});

import React from 'react';
import { shallow } from 'enzyme';
import EditSiteDialog from './EditSiteDialog';

describe('EditSiteDialog', () => {
  const shallowRender = ({
    title = 'Title',
    onSubmit = jest.fn().mockName('onSubmit'),
    onCancel = jest.fn().mockName('onCancel'),
    stack = { name: 'stackname', displayName: 'Display Name', description: 'description' },
    formComponent,
  }) => shallow(
    <EditSiteDialog {...{ title, onSubmit, onCancel, stack, formComponent }} />,
  );

  it('renders correctly passing values to provided from component', () => {
    const FormComponent = () => <div />;
    expect(shallowRender({ formComponent: FormComponent })).toMatchSnapshot();
  });
});

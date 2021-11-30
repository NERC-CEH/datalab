import React from 'react';
import { render, screen } from '@testing-library/react';
import CreateProjectDialog from './CreateProjectDialog';

jest.mock('../projects/CreateProjectForm', () => props => (<div>CreateProjectForm mock {JSON.stringify(props)}</div>));

describe('CreateProjectDialog', () => {
  it('renders to match snapshot passing function props to form', () => {
    render(<CreateProjectDialog
      onSubmit={jest.fn().mockName('onSubmit')}
      onCancel={jest.fn().mockName('onCancel')}
    />);
    expect(screen.getByRole('dialog')).toMatchSnapshot();
  });

  it('renders request form only if requestOnly is set', () => {
    render(<CreateProjectDialog
      onSubmit={jest.fn().mockName('onSubmit')}
      onCancel={jest.fn().mockName('onCancel')}
      requestOnly={true}
    />);
    expect(screen.getByRole('dialog')).toMatchSnapshot();
  });
});

import React from 'react';
import { shallow } from 'enzyme';
import NotebookButton from './NotebookButton';

it('NotebookButton renders correct snapshot', () => {
  // Arrange
  const notebook = {
    name: 'expectedName',
    url: 'notebookurl',
  };
  const openNotebookFn = () => {};

  // Act/Assert
  const renderedComponent = shallow(<NotebookButton
    notebook={notebook}
    openNotebookAction={openNotebookFn}/>);

  expect(renderedComponent).toMatchSnapshot();
});

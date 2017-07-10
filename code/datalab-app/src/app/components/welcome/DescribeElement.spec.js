import React from 'react';
import { shallow } from 'enzyme';
import DescribeElement from './DescribeElement';

it('DescribeElement renders correct snapshot', () => {
  // Arrange
  const props = {
    iconName: 'bug', // acutal semantic ui icon name
    title: 'expectedTitle',
    description: 'expectedDescription',
    secondColor: 'teal', // acutal semantic ui color name
  };

  // Act/Assert
  expect(shallow(<DescribeElement {...props} />)).toMatchSnapshot();
});

/* eslint-disable */
import 'jest-enzyme';
import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
/* eslint-enable */

Enzyme.configure({ adapter: new Adapter() });

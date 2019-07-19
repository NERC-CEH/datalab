import 'jest-enzyme';// eslint-disable-line no-unused-vars
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

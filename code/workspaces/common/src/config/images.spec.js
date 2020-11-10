import { lowerCase, upperCase } from 'lodash';
import { getImageInfoForType } from './images';

describe('getImageInfoForType', () => {
  describe('returns the information for specified type when it exists', () => {
    const imageType = 'rstudio';

    it('and the type is provided in lowercase', () => {
      expect(getImageInfoForType(lowerCase(imageType))).toMatchSnapshot();
    });

    it('and the type is provided in uppercase', () => {
      expect(getImageInfoForType(upperCase(imageType))).toMatchSnapshot();
    });
  });

  it('throws an error when the specified type does not exist', () => {
    try {
      getImageInfoForType('does not exist');
      // if gets to following line the not thrown error so fail test
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toEqual('Unable to find config for image of type "does not exist"');
    }
  });
});

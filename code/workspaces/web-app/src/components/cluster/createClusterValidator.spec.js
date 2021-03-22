import { syncValidate } from './createClusterValidator';

describe('syncValidate', () => {
  const getValidValues = () => ({
    displayName: 'Test Cluster',
    name: 'testcluster',
    volumeMount: 'teststore',
    maxWorkers: 5,
    maxWorkerMemoryGb: 4.5,
    maxWorkerCpu: 0.5,
  });

  const testValues = (fieldName, validValues, invalidValues) => {
    validValues.forEach((testValue) => {
      it(`as valid when value = ${testValue} and is typeof ${typeof testValue}`, () => {
        const valuesToValidate = getValidValues();
        valuesToValidate[fieldName] = testValue;
        const validationResult = syncValidate(valuesToValidate);
        expect(validationResult).toBeUndefined(); // no return value when all valid
      });
    });

    invalidValues.forEach((testValue) => {
      it(`as invalid when value = ${testValue} and is typeof ${typeof testValue}`, () => {
        const valuesToValidate = getValidValues();
        valuesToValidate[fieldName] = testValue;
        const validationResult = syncValidate(valuesToValidate);
        expect(validationResult).toBeDefined();
        expect(validationResult[fieldName]).toBeDefined(); // return of { fieldName: error } when invalid
      });
    });
  };

  describe('validates displayName', () => {
    const validValues = [
      'ab', // shortest can be
      'Testing', // can contain capitals
      'testing testing', // can contain spaces
      'testing123', // can contain numbers
    ];

    const invalidValues = [
      undefined, // must be present
      '', // too short
      'a', // too short
    ];

    testValues('displayName', validValues, invalidValues);
  });

  describe('validates name', () => {
    const validValues = [
      'test', // can contain lowercase letters
      'test123', // can contain numbers
    ];

    const invalidValues = [
      undefined, // must be present
      '', // too short
      'abc', // too short
      'test test', // can't contain spaces
      'test test test test', // too long
      'Test', // can't contain capitals
    ];

    testValues('name', validValues, invalidValues);
  });

  describe('validates volumeMount', () => {
    const validValues = [
      'teststore',
      undefined,
    ];
    const invalidValues = [];
    testValues('volumeMount', validValues, invalidValues);
  });

  describe('validates maxWorkers', () => {
    const validValues = [
      5, // is integer
    ];
    const invalidValues = [
      undefined, // must be present
      5.5, // is not integer
      '5', // can't be string
    ];
    testValues('maxWorkers', validValues, invalidValues);
  });

  describe('validates maxWorkerMemoryGb', () => {
    const validValues = [
      5, // can be integer
      5.5, // can be non-integer
    ];
    const invalidValues = [
      undefined, // must be present
      '5', // can't be string
    ];
    testValues('maxWorkerMemoryGb', validValues, invalidValues);
  });

  describe('validates maxWorkerCpu', () => {
    const validValues = [
      5, // can be integer
      5.5, // can be non-integer
    ];
    const invalidValues = [
      undefined, // must be present
      '5', // can't be string
    ];
    testValues('maxWorkerCpu', validValues, invalidValues);
  });
});

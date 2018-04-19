import { parseKubeName, getName, getType } from './kubernetesHelpers';

describe('Kubernetes helpers', () => {
  it('parseKubeName correctly parses name', () => {
    const kubeName = 'deploymentType-expectedName-anotherLabel';

    expect(parseKubeName(kubeName)).toEqual([
      'deploymentType',
      'expectedName-anotherLabel',
    ]);
  });

  it('getName correctly returns name', () => {
    const kubeName = 'expectedType-expectedName';

    expect(getName(kubeName)).toEqual('expectedName');
  });

  it('getType correctly returns name', () => {
    const kubeName = 'expectedType-expectedName';

    expect(getType(kubeName)).toEqual('expectedType');
  });
});

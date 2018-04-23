import { parseKubeName, getPodName, getPodType, parsePodLabels } from './kubernetesHelpers';

describe('Kubernetes helpers', () => {
  it('parseKubeName correctly parses name', () => {
    const kubeName = 'deploymentType-expectedName-anotherLabel';

    expect(parseKubeName(kubeName)).toEqual([
      'deploymentType',
      'expectedName-anotherLabel',
    ]);
  });

  it('getPodName correctly returns name', () => {
    const kubeName = 'expectedType-expectedName';

    expect(getPodName(kubeName)).toEqual('expectedName');
  });

  it('getPodType correctly returns name', () => {
    const kubeName = 'expectedType-expectedName';

    expect(getPodType(kubeName)).toEqual('expectedType');
  });

  it('parsePodLabels extracts pod name and type', () => {
    const labels = {
      name: 'expectedType-expectedName',
    };

    expect(parsePodLabels(labels)).toEqual({
      kubeName: 'expectedType-expectedName',
      name: 'expectedName',
      type: 'expectedType',
    });
  });

  it('parsePodLabels extracts pod type using selector label', () => {
    const labels = {
      name: 'differentType-expectedName',
      expectedSelector: 'expectedType',
    };

    expect(parsePodLabels(labels, 'expectedSelector')).toEqual({
      kubeName: 'differentType-expectedName',
      name: 'expectedName',
      type: 'expectedType',
    });
  });
});

import nameGenerators from './nameGenerators';

describe('nameGenerators', () => {
  it('has basic generators', () => {
    expect(nameGenerators.deploymentName('aName', 'aType')).toEqual('aType-aName');
    expect(nameGenerators.pvcName('aName')).toEqual('aName-claim');
    expect(nameGenerators.networkPolicyName('aName', 'aType')).toEqual('aType-aName-netpol');
    expect(nameGenerators.autoScalerName('aName', 'aType')).toEqual('aType-aName-hpa');
    expect(nameGenerators.podLabel('aName', 'aType')).toEqual('aType-aName-po');
    expect(nameGenerators.assetVolume('anAsset')).toEqual('asset-anAsset');
  });
});

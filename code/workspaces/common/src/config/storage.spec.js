import { storageTypes, storageCreationAllowedTypes, storageClass } from './storage';

describe('storage config', () => {
  it('returns storage types', () => {
    expect(storageTypes()).toEqual(['1', 'GLUSTERFS', 'NFS']);
  });

  it('returns storage types allowed in creation', () => {
    expect(storageCreationAllowedTypes()).toEqual(['GLUSTERFS', 'NFS']);
  });

  it('returns storage classes', () => {
    expect(storageClass('1')).toEqual('glusterfs-storage');
    expect(storageClass('GLUSTERFS')).toEqual('glusterfs-storage');
    expect(storageClass('NFS')).toEqual('nfs-storage');
  });
});

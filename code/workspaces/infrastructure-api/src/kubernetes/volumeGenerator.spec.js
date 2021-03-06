import volumeGenerator from './volumeGenerator';

describe('volumeGenerator', () => {
  describe('createVolume', () => {
    it('creates GlusterFS manifest', async () => {
      // Act
      const glusterFSManifest = await volumeGenerator.createVolume('volume-name', 5, 'GLUSTERFS');

      // Assert
      expect(glusterFSManifest).toMatch('name: volume-name');
      expect(glusterFSManifest).toMatch('storage: 5G');
      expect(glusterFSManifest).toMatch('storageClassName: glusterfs-storage');
    });

    it('creates NFS manifest', async () => {
      // Act
      const glusterFSManifest = await volumeGenerator.createVolume('volume-name', 5, 'NFS');

      // Assert
      expect(glusterFSManifest).toMatch('name: volume-name');
      expect(glusterFSManifest).toMatch('storage: 5G');
      expect(glusterFSManifest).toMatch('storageClassName: nfs-storage');
    });

    it('throws error for unexpected storage type', async () => {
      // Assert
      await expect(volumeGenerator.createVolume('volume-name', 5, '1')).rejects.toThrow('Unrecognized storage class type 1');
    });
  });
});

const assetLabel = asset => `${asset.name}:${asset.version} (${asset.fileLocation || 'no local file'})`;
export default assetLabel;

# Minio Browser

When accessing the storage volume through the Minio Browser/UI, there is a basic
upload function. This consists of using the UI to browse to the bucket that you
wish to upload a file to and selecting the plus button in the top right corner.

When uploading numerous small files, the easiest way to do this is to zip these
up into a single zip file which can then be uploaded and unzipped when in the lab
environment.

Limitations with this method are that when uploading large files (>10GB for example),
interruptions to the upload can cancel the entire operation as there is no resume
function. For occasions such as these it is worth considering the Minio client which
is more robust for large upload operations.

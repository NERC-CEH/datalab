# Minio Client

The Minio client is a CLI tool that can be used to interact with Minio (upload
and download files). This is a more robust solution in that it is able to upload
larger files as well as having useful features such as resuming interrupted
downloads.

In order to arrange to use this in DataLabs, first contact a DataLabs administrator
who will enable this for your storage and provide credentials to access the storage
remotely in the form of a secret key & an access key.

First download the Minio **client**. This is available for Linux, Windows & Mac.
The below example shows a download of the Linux client.

```bash
wget https://dl.minio.io/client/mc/release/linux-amd64/mc
chmod +x mc
```

Once downloaded, use MC to add the host for the storage you wish to access & upload
to. You will also need the URL of the Minio instance (can take this from the same URL
used to access Minio and remove the trailing URL e.g
<https://project-storage.datalabs.ceh.ac.uk>, make sure to replace the ACCESS_KEY and
SECRET_KEY with those that were earlier provided.)

```bash
./mc --insecure config host add minio_storage \\
https://project-storage.datalabs.ceh.ac.uk $ACCESS_KEY $SECRET_KEY
```

Once mc is configured to point to the storage, it can be interacted with in a
similar fashion to a standard UNIX file system. e.g

```bash
./mc --insecure ls minio_storage
./mc --insecure ls minio_storage/directory/
# Copy an example file in
./mc --insecure cp /tmp/local_file minio_storage/directory/
# Copy an entire directory in
./mc --insecure cp -r /tmp/localdirectory/ minio_storage/directory/
```

The full documentation for using mc can be found here - <https://docs.min.io/docs/minio-client-complete-guide.html>

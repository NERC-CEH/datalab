# Python

When accessing object storage with python there are a number of different
libraries than can be used. This guide will focus on a standard library
`boto3`. The general process is the same for other libraries.

## Setup

The following describes one way to configure the boto3 library to use the
credentials and endpoint as well as some basic activities such as downloading,
uploading, listing.

```python
# Set up the library and configuration
# The ACCESS_KEY, ACCESS_SECRET, and ENDPOINT will be provided when access
# is granted.
import boto3
session = boto3.session.Session()
s3_client = session.client(
  service_name='s3',
  aws_access_key_id=ACCESS_KEY,
  aws_secret_access_key=ACCESS_SECRET,
  endpoint_url=ENDPOINT
)
```

### Buckets

Listing buckets

```python
response = s3_client.list_buckets()
for bucket in response['Buckets']:
    print(bucket['Name'])
```

Making buckets

```python
s3_client.create_bucket(Bucket='my-new-bucket')
```

List contents of bucket

```python
response = s3_client.list_objects(Bucket=BUCKET_NAME)
print(response)
```

### Files

Download File

```python
# Key is the name of the file in the bucket you wish to download, and Filename
# is the name of the resulting file that will be saved in the local directory
s3_client.download_file(
  Bucket=BUCKET_NAME,
  Key='exampleFile1',
  Filename='downloaded_file'
)
```

Upload File

```python
# Filename is the path to the file to upload, Key is the name of the resulting
# uploaded file in the bucket specified.
s3_client.upload_file(
  Filename='downloaded_file',
  Key='exampleFile1_uploaded',
  Bucket=BUCKET_NAME,
)
```

File Contents Into Memory

```python
# Rather than downloading the file, this reads the file directly into a
# variable
response = s3_client.get_object(
  Bucket=BUCKET_NAME,
  Key='exampleFile1_uploaded'
)
var=response['Body']
```

#### Further Reading

Boto3 is a common library for which there is a lot of available documentation,
this can be found [here](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html)

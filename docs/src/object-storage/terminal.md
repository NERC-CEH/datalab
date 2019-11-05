# Terminal

There are a number of different command line tools that can be used from within
the labs to access/use the object storage, this will focus on using `s3cmd`.

## Installation

`s3cmd` is a common OS package that should be available via standard
repositories, hence from a Terminal session in Jupyter for example;

```bash
sudo apt update && sudo apt install -y s3cmd
```

## Setup

Once installed, `s3cmd` can be configured interactively as follows;

```bash
$ s3cmd --configure

Enter new values or accept defaults in brackets with Enter.
Refer to user manual for detailed description of all options.

Access key and Secret key are your identifiers for Amazon S3. Leave them empty
for using the env variables.
Access Key []:
...
```

Ensure the correct values are entered when prompted - the main options which
will be configured are `Access Key`, `Secret Key`, and `S3 Endpoint`.

Once this is complete, the output will be written to `~/.s3cfg`

## Usage

`s3cmd` usage is relatively simple and copies the usage of many standard
POSIX commands and can be found with `s3cmd --help`, some simple examples are
below.

List Buckets

```bash
$ s3cmd ls
2019-03-21 15:41  s3://bucket1
2019-09-03 15:07  s3://bucket2
2019-08-28 08:06  s3://another-bucket
```

List Files in a Bucket

```bash
$ s3cmd ls s3://bucket1
2019-03-21 15:42        46   s3://bucket1/file-in-bucket1
```

Upload a File to a Bucket

```bash
s3cmd put another-file s3://bucket1
upload: 'another-file' -> 's3://bucket1/another-file'  [1 of 1]
 0 of 0     0% in    2s     0.00 B/s  done
```

Download a File from a Bucket

```bash
s3cmd get s3://bucket1/another-file
download: 's3://bucket1/another-file' -> './another-file'  [1 of 1]
 0 of 0     0% in    3s     0.00 B/s  done
```

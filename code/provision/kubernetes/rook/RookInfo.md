# Rook Cluster Creation

Followed instructions from [Rook](https://github.com/rook/rook)

## Create Cluster

Run the following Kubernetes definitions in order

```
kubectl create -f rook-operator.yaml
kubectl create -f rook-cluster.yaml
```

## Create External Service

Rook by default creates an internal service. Create an external service (if required) by
running.

```
kubectl create -f rook-external-service.yaml
```

## Managing the cluster

To create an object store. Create a client pod

```
kubectl create -f rook-client.yaml
```

Find the pod and connect when it is up

```
# Check when the pod is in the Running state
kubectl -n rook get pod rook-client

# Connect to the client pod
kubectl -n rook exec rook-client -it sh

# Verify the rook client can talk to the cluster
rook node ls
```

### Create object store

To create an object store connecto the client pod and run

```
rook object create
rook object user create rook-user "A rook rgw User"
```

First time this was run gave an error, probably because the cluster wasn't fully up.

## Rook Tools

Various Rook tools are packaged into the rook-tools pod. Create by running

```
kubectl create -f rook-tools.yaml
```

### Test Object store (from cluster)

Connect to tools pod and run

```
eval $(rook object connection rook-user --format env-var)

# Create a bucket (space before s3:// is important!)
s3cmd mb --no-ssl --host=${AWS_ENDPOINT} --host-bucket=  s3://rookbucket

# List buckets
rook object bucket list

# Upload a file
echo "Hello Rook!" > /tmp/rookObj
s3cmd put /tmp/rookObj --no-ssl --host=${AWS_ENDPOINT} --host-bucket=  s3://rookbucket

# Download a file
s3cmd get s3://rookbucket/rookObj /tmp/rookObj-download --no-ssl --host=${AWS_ENDPOINT} --host-bucket=
cat /tmp/rookObj-download
```

### Test Object store (locally)

Ensure that SSH tunnel is open to the external service (localhost:7006 for example).

Download and configure [s3cmd](http://s3tools.org/) to be on the PATH.

Export the follow environment variables. Note that keys are displayed when the user is created and are available from the tools pod with
```rook object connection rook-user --format env-var``` if lost.

```
AWS_HOST=rook-rgw
AWS_ENDPOINT=127.0.0.1:7006   # NOTE This can't be localhost
AWS_ACCESS_KEY_ID=<access key>
AWS_SECRET_ACCESS_KEY=<secret key>
```

Execute commands against the object store

```
s3cmd get s3://rookbucket/rookObj ./rookObj-download --no-ssl --host=${AWS_ENDPOINT} --host-bucket=
```

## URLS for Spark S3 integration

https://databricks.gitbooks.io/databricks-spark-reference-applications/content/logs_analyzer/chapter2/s3.html
https://gist.github.com/tobilg/e03dbc474ba976b9f235

User ID:        rook-user
Display Name:   Rook user
Email:
Access Key:     KGF2SZ8M5JYX79FD3H9I
Secret Key:     E0rYcePooO68B5jP51cArQVdYb41C5TC4arHy61i

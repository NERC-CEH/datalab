# Dynamic Proxy

The dynamic proxy has two components:

* Node.JS/Express Proxy and API
* ETCD data store

The Proxy is built using the [Redbird](https://github.com/OptimalBits/redbird) library.

## Development

In order to make development easier a docker-compose file has been added that brings up
the dynamic proxy using the current code along with an ETCD container and an nginx
container as a test target.

```
docker-compose -f docker-compose-dev.yml up -d
```

To populate a test rule for the nginx container run:

```
curl -H "Content-Type: application/json" \
  --data '{"source":"localhost","target":"http://testservice"}' \
  http://localhost:8081/routes
```

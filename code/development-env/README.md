# Setup local development environment

## Initial set-up

### Using docker-machine (Windows)

- Start docker-machine
- Update mongo and vault addresses

```bash
DOCKER_ADDRESS=`docker-machine ip`
export DATABASE_HOST=${DOCKER_ADDRESS}
export VAULT_API="http://${DOCKER_ADDRESS}:8200"
```

### Start docker containers

Mongo will be pre-seeded with data.

```bash
docker-compose -f ./docker/docker-compose.yml up -d
```

### Set-up minikube

- Start minikube
- Enable ingress controller
  - `minikube addons enable ingress`
- Create namespace
  - `kubectl create namespace test`
- Change default namespace
  - `kubectl config set-context minikube --namespace=test`
- Create and load TLS certificates
  - see README in `./config/ca/`
- Update and apply manifests
  - see README in `./manifests/`

### Start DNSMasq

- See README in `./config/dnsmasq`


## Start local development environments

### Datalabs APP/API

- Set environmental variables for API
- Start infrastructure api 'yarn start'

```bash
export VAULT_APP_ROLE= # Set to value from ./scripts/configure-vault.sh

# Use stub Auth
export AUTHORISATION_SERVICE_STUB=true

# For docker machine
export DATABASE_HOST=${DOCKER_ADDRESS}
export VAULT_API="http://${DOCKER_ADDRESS}:8200"
```


### Infrastructure API

- Set environmental variables
- Start proxy to minikube in separate terminal
- Start infrastructure api 'yarn start'

```bash
export KUBERNETES_NAMESPACE=test # Or minikube namespace
export VAULT_APP_ROLE= # Set to value from ./scripts/configure-vault.sh

# For docker machine
export VAULT_API="http://${DOCKER_ADDRESS}:8200"
```

### Authorisation service

- Set environmental variables

```bash
export AUTHORISATION_API_CLIENT_ID= # from Auth0
export AUTHORISATION_API_CLIENT_SECRET= # from Auth0
export AUTHORISATION_API_IDENTIFIER= # from Auth0
```

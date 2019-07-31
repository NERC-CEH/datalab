# Setup local development environment

## Initial set-up

### Start MongoDB and Vault docker containers

MongoDB will be pre-seeded with data on start-up.

```bash
docker-compose -f ./docker/docker-compose-mongo.yml -f ./docker/docker-compose-vault up -d
```

### Start and configure Minikube

- Start minikube
  - `minikube start`
- Enable add-ons
  - `minikube addons enable ingress`
- Create namespace
  - `kubectl create namespace devtest`
- Change default namespace
  - `kubectl config set-context minikube --namespace=devtest`
- Update and apply manifests
  - see README in `./manifests/`


## Start local development environments

### Datalabs APP/API

- Set environmental variables for API
- Start infrastructure api 'yarn start'

```bash
export VAULT_APP_ROLE= # Set to value from ./scripts/configure-vault.sh

# Use stub Auth
export AUTHORISATION_SERVICE_STUB=true
```

### Infrastructure API

- Set environmental variables
- Start proxy to minikube in separate terminal
- Start infrastructure api 'yarn start'

```bash
export KUBERNETES_NAMESPACE=devtest # Or minikube namespace
export VAULT_APP_ROLE= # Set to value from ./scripts/configure-vault.sh
```

### Authorisation service

- Set environmental variables

```bash
export AUTHORISATION_API_CLIENT_ID= # from Auth0
export AUTHORISATION_API_CLIENT_SECRET= # from Auth0
export AUTHORISATION_API_IDENTIFIER= # from Auth0
```

### Start APP/API, Auth and Infra Services

Local services may either be started on the local host directly, `yarn start` in
the service directory, or by starting the services with docker-compose see
README in `./docker`.


### (Optional) Start DNSMasq

Chrome will resolve sub-domains on the localhost  domain (ie. `*.localhost`) to
the host machine, other browser may not response the same way. If a domain other
than `*.localhost` is used for local development a local DNS must be set-up to
resolve from a browser.

- See README in `./config/dnsmasq`

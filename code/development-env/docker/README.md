# Setup local development environment using docker-compose

- Set environment variables for auth-services

```bash
export AUTHORISATION_API_CLIENT_ID= # from Auth0
export AUTHORISATION_API_CLIENT_SECRET= # from Auth0
export AUTHORISATION_API_IDENTIFIER= # from Auth0
```

- Start mongo & vault containers

```bash
docker-compose -f docker-compose-vault.yml -f docker-compose-mongo.yml up -d
```

- Set Vault-App-Role token

```bash
./scripts/configure-vault.sh
export VAULT_APP_ROLE= # Set to value from line above
```

- Start minikube proxy

```bash
kubectl proxy
```

- Start DataLab APP/API, Infrastructure Api & Auth services

```bash
docker-compose -f docker-compose-app.yml up
```

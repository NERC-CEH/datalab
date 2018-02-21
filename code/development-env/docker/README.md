# Setup local development environment using docker-compose

- Set environment variables for auth-services

```bash
export AUTHORISATION_API_CLIENT_ID= # from Auth0
export AUTHORISATION_API_CLIENT_SECRET= # from Auth0
export AUTHORISATION_API_IDENTIFIER= # from Auth0
```

- Start docker containers

```bash
docker-compose -f docker-compose-vault.yml -f docker-compose-mongo.yml -f docker-compose-app.yml up -d
```

- Restarting containers will replace mongo collection, comment out `mongodb_import`

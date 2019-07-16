# Setup local development environment using docker-compose

## Set-up minikube

- Start minikube
- Enable ingress controller
  - `minikube addons enable ingress`
- Create namespace
  - `kubectl create namespace devtest`
- Change default namespace
  - `kubectl config set-context minikube --namespace=devtest`
  
## Install Packages

- Run `yarn` in each of the following directories:
  - `code/auth-service`
  - `code/datalab-app`
  - `code/infrastructure-api`
  
## Set-up Environment  

- Set environment variables for auth-services

```bash
export AUTHORISATION_API_CLIENT_ID= # from Auth0
export AUTHORISATION_API_CLIENT_SECRET= # from Auth0
export AUTHORISATION_API_IDENTIFIER= # from Auth0
export USER_MANAGEMENT_API_CLIENT_ID= # from Auth0
export USER_MANAGEMENT_API_CLIENT_SECRET= # from Auth0
```

## Run Containers

- Start mongo & vault containers

```bash
docker-compose -f docker-compose-vault.yml -f docker-compose-mongo.yml up -d
```

- Set Vault-App-Role token

```bash
../scripts/configure-vault.sh
export VAULT_APP_ROLE= # Set to value output from command on line above
```

- Start minikube proxy

```bash
kubectl proxy --address 0.0.0.0 --accept-hosts '.*'
```

- Start DataLab APP/API, Infrastructure Api and Auth services. If running on Mac or Linux, 
replace `<platform>` with `mac` or `linux` as appropriate. Otherwise, remove 
`-f docker-compose-app.<platform>.yml` from command.

```bash
docker-compose -f docker-compose-app.yml -f docker-compose-app.<platform>.yml up
```


## Update Mongo Record

The default record that is created in the Mongo container needs to be updated so that 
it will be displayed in the UI. To do this, you will need an Auth0 account.

- Login to [Auth0](https://manage.auth0.com).
- Click on `Users & Roles` on the left hand side of the screen and then click `Users`.
- Find yourself in the list of users and click on your email address.
- Scroll down to `Identity Provider Attributes` section and copy the `user_id` value.
- Connect to mongo using a tool such as [Robomongo](https://robomongo.org/download).
This will be running on `localhost:27017` if the mongo contain from 
[Run Containers](#run-containers) is running.
- Open `datalab -> Collections -> dataStorage`.
- Edit the single document shown by adding a string containing your `user_id` to the 
`users` array i.e. if your `user_id = auth0|myId`, `users` should be updated such that
`users: ["auth0|myId"]`.
- Save the changes. 

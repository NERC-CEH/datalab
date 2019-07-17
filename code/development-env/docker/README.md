# Setup local development environment using docker-compose

## Set-up minikube

* Start minikube
* Enable ingress controller
  * `minikube addons enable ingress`
* (Optional) Install [`kubectx` and `kubens`](https://github.com/ahmetb/kubectx)
  for easy context and namespace switching.
* Create namespace
  * `kubectl create namespace devtest`
* Change default namespace
  * `kubectl config set-context minikube --namespace=devtest`
    or `kubectx minikube && kubens devtest`

## Install Packages

* Run `yarn` in each of the following directories:
  * `code/auth-service`
  * `code/datalab-app`
  * `code/infrastructure-api`

## Set-up Environment

There are a number of authorisation related environmental variables that need to be set
to make the app work locally. [`direnv`](https://direnv.net) can be used to
automatically set an unset these variables as you enter and leave the repository
directories on your local machine. This is most easily installed on macOS using the
[Homebrew](https://brew.sh) package manager by running the command
`brew install direnv`. Once `direnv` is installed, follow the instructions
[here](https://direnv.net/docs/hook.md) to get it working.

`drienv` knows what environment variable to set by parsing a file called `.envrc`.
The variables in the `.envrc` file will be set when in the directory containing the
`.envrc` file or any of its child directories. Therefore, create a `.envrc` in the
directory one level above the datalab repository's directory on your machine (helps
avoid accidentally committing the file). There is a note in the shared Datalabs
LastPass folder called `Dev Env Secrets`. Copy the contents of this note into your
`.envrc` file.

## Update Mongo Default Record Initial Value

Database records can only be viewed by specified users. To be able to view the default
mongo record created when the mongo container is started, you need to add your Auth0
`user_id` to the `users` array in the seed document. This seed document is located at
`code/development-env/config/mongo/dataStorageCollection.json`.

To get your Auth0 `user_id`, do the following:  

* Login to [Auth0](https://manage.auth0.com).
* Click on `Users & Roles` on the left hand side of the screen and then click `Users`.
* Find yourself in the list of users and click on your email address.
* Scroll down to `Identity Provider Attributes` section and copy the `user_id` value
  (including the `auth0|` section).

## Run Containers

* Start mongo & vault containers

```bash
docker-compose -f docker-compose-vault.yml -f docker-compose-mongo.yml up -d
```

* Set Vault-App-Role token

```bash
../scripts/configure-vault.sh
export VAULT_APP_ROLE= # Set to value output from command on line above
```

* Start minikube proxy

```bash
kubectl proxy --address 0.0.0.0 --accept-hosts '.*'
```

* Start DataLab APP/API, Infrastructure Api and Auth services. If running on Mac or
  Linux, replace `<platform>` with `mac` or `linux` as appropriate. Otherwise, remove
  `-f docker-compose-app.<platform>.yml` from command.

```bash
docker-compose -f docker-compose-app.yml -f docker-compose-app.<platform>.yml up
```

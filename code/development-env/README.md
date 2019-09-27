# Setup local development environment

## General setup

### Pre-requisites

* NodeJS 8.16
* Yarn
* Docker
* Docker-Compose
* Minikube
* OpenSSL
* JQ
* (Recommended) VirutalBox -- virtualisation provider for Minikube
* (Recommended) DNSMasq -- for local wildcard DNS other than `*.localhost`

### MacOS specific installation

* [Install Homebrew](https://brew.sh/)
* [Install Docker for Mac](https://hub.docker.com/editions/community/docker-ce-desktop-mac).
* [Install kubectl with Homebrew](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl-on-macos)
  * Docker for Mac (above) will install a version of `kubectl` at /Applications/Docker.app/Contents/Resources/bin,
    and then link to it from /usr/local/bin/kubectl (which you can tell by `ls -l /usr/local/bin/kubectl`).
  * `kubectl` from Homebrew will install to a different location, but not overwrite the symbolic link.
  * You want `/usr/local/bin/kubectl` to be the one from Homebrew - to do this, run `brew link --overwrite kubernetes-cli`
* [Install VirtualBox](https://www.virtualbox.org/wiki/Downloads)
* [Allow system software from Oracle](https://stackoverflow.com/questions/52277019/how-to-fix-vm-issue-with-minikube-start)
* [Install minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/)
* Install yarn: `brew install yarn`
* Install jq: `brew install jq`
* (Recommended) Install dnsmasq: `brew install dnsmasq`

### Set-up minikube

* Start minikube
  * `minikube start`
* (Recommended) [Install `kubectx` and `kubens`](https://github.com/ahmetb/kubectx)
  for easy context and namespace switching.
* When creating a new minikube cluster follow these [instructions](../manifests/README.md).

### Install NodeJS packages

* Run `yarn` in each of the following directories:
  * `code`
  * `code/auth-service`
  * `code/infrastructure-api`

Running the `yarn` commend within the `code/` directory will install all the
packages required for services within the workspace (these services within the
`code/workspaces` directory; Web-App, Client-API, etc).

Git-hooks (via husky) will enable when running the install step above. This will
enforce linting rules for any files being staged. Any errors highlighted will
need to be address before the git commit will be permitted. This rule checking
may be disabled using the `--no-verify` flag with `git commit`, this is not
recommended as linting error will still be caught with the CI server.

### Set-up shell environment varaibles

There are a number of authorisation related environmental variables that need to be set
to make the app work locally. [`direnv`](https://direnv.net) can be used to
automatically set and unset these variables as you enter and leave the repository
directories on your local machine. This is most easily installed on macOS using the
[Homebrew](https://brew.sh) package manager by running the command
`brew install direnv`. Once `direnv` is installed, follow the instructions
[here](https://direnv.net/docs/hook.md) to get it working
(note - for MacOS, use .bash_profile, not .bashrc).

`direnv` knows what environment variable to set by parsing a file called `.envrc`.
The variables in the `.envrc` file will be set when in the directory containing the
`.envrc` file or any of its child directories. Therefore, create a `.envrc` in the
directory one level above the datalab repository's directory on your machine (helps
avoid accidentally committing the file). There is a note in the shared Datalabs
LastPass folder called `Dev Env Secrets`. Copy the contents of this note into your
`.envrc` file.

When you cd into the .envrc folder (or one of its children), you should see

```bash
direnv: loading ../../../.envrc
direnv: export +AUTHORISATION_API_CLIENT_ID +AUTHORISATION_API_CLIENT_SECRET +AUTHORISATION_API_IDENTIFIER +USER_MANAGEMENT_API_CLIENT_ID +USER_MANAGEMENT_API_CLIENT_SECRET
```

### Update Mongo default record initial value

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

## Wildcard DNS & Certificate Authority

Chrome will resolve sub-domains on the localhost  domain (ie. `*.localhost`) to
the host machine, other browser may not response the same way. If a domain other
than `*.localhost` is used for local development a local DNS must be set-up to
resolve from a browser. See README in `./config/dnsmasq`.

Development tls certificates have been generated and stored in the `./config/ca`
these provide tls certificates for the `*.datalabs.localhost` subdomain. If a
different subdomain is used new certificate will need to be generated using the
same root certificate. See README in `./config/ca`.

### Make development CA root certificate trusted for host system (MacOS)

* Open `keychain access` and drag `rootCA.pem` file into window
* Double click the newly install DataLabs certificate and set trust to `Always Trust`

## Minikube

### Create `devtest` namespace

```bash
kubectl apply -f ./config/manifests/minikube-namespace.yml
kubectl config set-context minikube --namespace=devtest
```

### Create storage class and PVC

```bash
minikube addons enable storage-provisioner
kubectl apply -f ./config/manifests/minikube-storage.yml
kubectl apply -f ./config/manifests/minikube-pvc.yml
```

### Add website tls x509 certificate as Kubernetes secret

This secret must be created __before__ adding ingress rules.

```bash
kubectl create secret tls tls-secret --key ./config/ca/datalab.localhost.key --cert ./config/ca/datalab.localhost.crt -n devtest
```

### Create ingress rules to point back to host machine

We can add ingress rules to use a loopback ip address to access element on the
host machine. These rules use self-signed TLS certificates, these must be
generated and stored as Kubernetes secrets __before__ creating the ingress
rules. When running minikube in VirtualBox this address is expected to be
`10.0.2.2` (this is the gateway address given to minikube by VirtualBox).

```bash
kubectl apply -f ./config/manifests/minikube-proxy.yml
```

### Clearing Minikube IP address when creating new cluster (MacOS)

VirtualBox will retain leases for local IP address, when creating a new cluster
a new IP address will be assigned. These can be cleared by deleting VirtualBox
DHCP leases (`rm ~/Library/VirtualBox/HostInterfaceNetworking-vboxnet0-Dhcpd.*`)

The current ip for minikube can be found using `minikube ip`.

## Docker-Compose

### Run Containers

* Start mongo & vault containers

```bash
docker-compose -f ./docker/docker-compose-vault.yml -f ./docker/docker-compose-mongo.yml up -d
```

* Set Vault-App-Role token

```bash
./scripts/configure-vault.sh
export VAULT_APP_ROLE= # Set to value output from command on line above
```

* Start minikube proxy, in separate terminal

```bash
kubectl proxy --address 0.0.0.0 --accept-hosts '.*'
```

* Start DataLab App, DataLab Api, Infrastructure Api and Auth services.

```bash
docker-compose -f ./docker/docker-compose-vault.yml -f ./docker/docker-compose-mongo.yml -f ./docker/docker-compose-app.yml -f ./docker/docker-compose-proxy.yml up -d
```

You should eventually see a message saying `You can now view datalab-app in the browser.`

## Testing APIs

The [Insomnia Rest client](https://insomnia.rest/) is recommended for testing APIs
during development. Detailed instructions for how to do this can be found
[here](./insomnia/README.md) including a definition file that can be imported.

## Running Mock GraphQL Server

A Mock GraphQL server can be run in place of the real Client API GraphQL server. This automatically generates responses
to queries using canned data. To start the mock server run the following command in the `code/workspaces/client-api`
directory.

```
yarn mock
```

More details of how to extend and configure the mock are located in the `README` for the client-api service.

## Git Hooks

Git hooks have been created to lint all staged files with the `.js` extension
and formatting of the git commit message on execution of the `git commit`
command, these hooks will block the commit if the linting fails or the commit
message is not correctly formatted. These hooks are defined in the root package
json for the Yarn Workspaces (`code\package.json`). Running `yarn` in this
directory will install this functionality.

To commit without validation via the git hooks use the following command:

```sh
git commit --no-verify
```

To permanently disable the git hooks remove the `"pre-commit": "lint-staged"`
line from the Yarn Workspace root `package.json`.

## Code Climate

[Code climate](https://codeclimate.com/github/NERC-CEH/datalab) is used to track
the code quality in the data labs code base. Rule sets are applied for:

* ~~ESLint~~
* CSS
* Markdown
* Code Duplication

### Run Code Climate locally

When resolving issues it can be useful to run code climate locally rather than
have to commit and push a branch.
[Code climate CLI](https://github.com/codeclimate/codeclimate) is shipped as a
docker container so provided docker is installed it can be run with

```bash
docker run \
  --interactive --tty --rm \
  --env CODECLIMATE_CODE="$PWD" \
  --volume "$PWD":/code \
  --volume /var/run/docker.sock:/var/run/docker.sock \
  --volume /tmp/cc:/tmp/cc \
  codeclimate/codeclimate analyze
```

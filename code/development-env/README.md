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

* Start minikube (you can ensure virtual box uses the same IP address by following [these instructions](#clearing-minikube-ip-address-when-creating-new-cluster-macos))
  * `minikube start`
  * Or give the minikube cluster a different name using the `-p` flag e.g. `minikube -p datalabs start` (note that you will need to us the `-p` flag to refer to this instance of minikube in subsequent commands e.g. `minikube -p datalabs stop`).
* (Recommended) [Install `kubectx` and `kubens`](https://github.com/ahmetb/kubectx)
  for easy context and namespace switching.
* Create a Gluster and NFS storage class by running `kubectl apply -f ./config/manifests/minikube-storage.yml`
* Create compute submission cluster role by running `kubectl apply -f ./config/manifests/minikube-compute-submission-role.yml`
* (Other potentially useful manifests can be found in `./config/manifests/`)

#### Clearing Minikube IP address when creating new cluster (MacOS)

VirtualBox will retain leases for local IP address, when creating a new cluster
a new IP address will be assigned. These can be cleared by deleting VirtualBox
DHCP leases (`rm ~/Library/VirtualBox/HostInterfaceNetworking-vboxnet0-Dhcpd.*`)

The current IP for minikube can be found using `minikube ip`.

### Install NodeJS packages

* Run `yarn` in each of the following directories:
  * `code`
  * `code/auth-service`
  * `code/infrastructure-api`

Running the `yarn` command within the `code/` directory will install all the
packages required for services within the workspace (these services within the
`code/workspaces` directory; Web-App, Client-API, etc).

Git-hooks (via husky) will enable when running the install step above. This will
enforce linting rules for any files being staged. Any errors highlighted will
need to be address before the git commit will be permitted. This rule checking
may be disabled using the `--no-verify` flag with `git commit`, this is not
recommended as linting error will still be caught with the CI server.

### Set-up shell environment variables

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
direnv: export +AUTHORISATION_API_IDENTIFIER
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

Chrome and FireFox will resolve sub-domains on the localhost domain (i.e. `*.localhost`) to
the host machine; other browsers may not respond the same way. If a domain other
than `*.localhost` is used for local development a local DNS must be set-up to
resolve from a browser. See README in `./config/dnsmasq`.

Development TLS certificates have been generated and stored in the `./config/ca` directory.
These provide TLS certificates for the `*.datalabs.localhost` and `*.datalabs.internal` subdomains.
If a different subdomain is used, new certificates will need to be generated using the
same root certificate. See README in `./config/ca`.

### Make development CA root certificate trusted for host system (MacOS)

* Open `keychain access` and drag `rootCA.pem` file into window
* Double click the newly install DataLabs certificate and set trust to `Always Trust`
* FireFox doesn't use the machine's trusted certificate authorities by default. An option
  needs to be turned on in Firefox to make this happen. This can be done by entering
  `about:config` into the address bar and then setting `security.enterprise_roots.enabled`
  to true ([reference](https://support.mozilla.org/en-US/kb/setting-certificate-authorities-firefox)).

The Client API might give SSL/TLS errors when trying to communicate with services running within minikube.
If this is the case, provide node the path to the `rootCA.pem` file using the environment variable `NODE_EXTRA_CA_CERTS`.
If you are running the client api with docker, the pem file will need to be mounted into the container and the value of `NODE_EXTRA_CA_CERTS` will need to be the path to the pem file from within the container.

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

### Enabling access to cluster from host machine

There are two domains through which you can access the cluster from the host machine (once configured) that configuration information is provided for.
The first and simpler of the two is `datalabs.localhost` (see [datalabs-localhost-setup.md](./datalabs-localhost-setup.md)) but this might not work on all machines.
If this does not work, then you can configure access to be through `.datalabs.internal` instead (see [datalabs-internal-setup.md](./datalabs-internal-setup.md)).

#### Configuring ingress auth

When notebooks etc. are created, an ingress rule is added such that they can be accessed.
The ingress rule contains a URL to check that the user accessing the resource has permission to view it which is expected to be the URL of the auth service.
The infrastructure api (responsible for creating the ingress) and the auth service are not running in the cluster, but the dynamically created notebooks are created within the cluster.
Therefore, the URL of the auth service is different for the infrastructure service and the notebooks.
The IP address that is used in the ingress rule can be configured using the following environment variable

```bash
AUTHORISATION_SERVICE_FOR_INGRESS=<ip to access auth service>
```

where `<ip-to-access-auth-service>` needs to be configured to be the IP address and port through which a service in the cluster can access the authorisation service running on `localhost`.
From VirtualBox, this is expected to be `http://10.0.2.2:9000` as `10.0.2.2` is the IP through which items running in VirtualBox can access the host machine, and the auth service is configured to run on port `9000` by default.

#### Correctly resolving and accessing notebooks

The client api expects to be running in the cluster alongside the notebooks.
Therefore, by default it will try and access a notebook using the notebook's internal DNS name.
Unsurprisingly, trying to resolve this name from outside of the cluster does not work.
Setting the following environment variable tells the client api that it should use the notebook's external name when trying to access it.

```bash
DEPLOYED_IN_CLUSTER="false"
```

When accessing the notebooks from outside of the cluster (specifically when the system is configured to run on `datalabs.internal`), you may find that the auth service rejects the incoming requests with a warning message such as `warn: Unsuccessful authentication request from localhost`.
If this is the case, you will manually need to provide a valid cookie that will be appended to all requests to `datalabs.internal` (it will not be appended to any requests to any other domains).
The cookie is provided by setting the value of the environment variable `TESTING_COOKIE` on the client api to be the value of the `authorization` cookie.
The value of the cookie can be obtained through a web browser's development tools once successfully logged into the DataLabs web-app locally.

## Docker-Compose

### Run Containers

* Start minikube proxy, in separate terminal

```bash
kubectl proxy --address 0.0.0.0 --accept-hosts '.*'
```

* Start Mongo, DataLab App, DataLab Api, Infrastructure Api and Auth services.

```bash
docker-compose -f ./docker/docker-compose-mongo.yml -f ./docker/docker-compose-app.yml -f ./docker/docker-compose-proxy.yml up -d --remove-orphans
```

You should eventually see a message from the web-app saying `You can now view datalab-app in the browser.`

### Running with Keycloak

If you wish to use a local authentication provider rather than auth0 to test this is possible by the following modifications to the `./docker/docker-compose-app.yml` file;

- Unhash the lines in the auth service marked as "`OIDC_*`".
- Hash out the line in the app service relating to `web_auth_config.json` and unhash the next line containing `web_auth_config_keycloak.json`.

Keycloak must be resolvable both by the auth service as well as your local desktop, as keycloak is addressable by default using the docker network by its service name, the easiest way to make it work locally is to add a local DNS entry or a localhost entry for keycloak e.g;

```bash
127.0.0.1 keycloak
```

Finally, use the following command to start the app in place of the final one used above. When setting up for the first time it may take a minute before login is available as the OIDC client is set up for the first time.

```bash
docker-compose -f ./docker/docker-compose-mongo.yml -f ./docker/docker-compose-app.yml -f ./docker/docker-compose-proxy.yml -f ./docker/docker-compose-keycloak.yml up -d
```

## Testing APIs

The [Insomnia Rest client](https://insomnia.rest/) is recommended for testing APIs
during development. Detailed instructions for how to do this can be found
[here](./insomnia/README.md) including a definition file that can be imported.

## Telepresence

[Telepresence](https://www.telepresence.io/) can be installed, allowing you to e.g. investigate issues on the test system which you cannot reproduce locally.

### auth-service
```
cd datalab/code/workspaces/auth-service
kubectx datalabs
telepresence --expose 9000:9000 --swap-deployment datalab-auth-deployment
export AUTHORISATION_PERMISSIONS=${PWD}/resources/permissions.yml
export PRIVATE_KEY=${PWD}/resources/private.pem
export PUBLIC_KEY=${PWD}/resources/public.pem
yarn start
```

### infrastructure-api
```
cd datalab/code/workspaces/infrastructure-api
kubectx datalabs
telepresence --expose 8000:8000 --swap-deployment infrastructure-api-deployment
yarn start
```

### client-api
```
cd datalab/code/workspaces/client-api
kubectx datalabs
telepresence --expose 8000:8000 --swap-deployment datalab-api-deployment
yarn start
```

### web-app
```
cd datalab/code/workspaces/web-app
kubectx datalabs
telepresence --expose 3000:80 --swap-deployment datalab-app-deployment
yarn start
```

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

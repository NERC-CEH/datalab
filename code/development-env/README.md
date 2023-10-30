# Setup local development environment

Unless stated otherwise, the following instructions are for MacOS Catalina.

## Installations

### Essential

* [brew](https://brew.sh/) (Mac only)
* [Node Version Manager](https://github.com/nvm-sh/nvm)
* Node.js LTS: `nvm install lts`
* [Yarn](https://yarnpkg.com/getting-started/install)
* [Docker](https://docs.docker.com/get-docker/)
* [Docker Compose](https://docs.docker.com/compose/install/) (installed with Docker for MacOS)
* An development environment capable of running Kubernetes
  * Option 1 (Recommended for Mac)
    * [Minikube](https://minikube.sigs.k8s.io/docs/start/)
    * [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
  * Option 2 (Recommended for Linux)
    * [k3s](https://k3s.io/)
* [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
* [dnsmasq](http://www.thekelleys.org.uk/dnsmasq/doc.html): `brew install dnsmasq`

### Recommended depending on environment

* [direnv](https://direnv.net/docs/installation.html)
* [kubectx + kubens](https://github.com/ahmetb/kubectx)
* [kube-ps1](https://github.com/jonmosco/kube-ps1)
* [helm](https://helm.sh/docs/intro/install/#from-homebrew-macos)
* [Robo 3T](https://robomongo.org/download)
* [Compass](https://www.mongodb.com/try/download/compass) (Alternative to Robo 3T)
* [Visual Studio Code](https://code.visualstudio.com/)

## Configurations

### direnv (recommended)

There are a number of environmental variables that need to be set
to make the app work locally.

[`direnv`](https://direnv.net) can be used to
automatically set and unset these variables as you enter and leave the repository
directories on your local machine.
Once `direnv` is installed, follow the [instructions](https://direnv.net/docs/hook.md) to hook it into your shell
(note - for MacOS not yet using zsh, use .bash_profile, not .bashrc).

`direnv` knows what environment variable to set by parsing a file called `.envrc`.
The variables in the `.envrc` file will be set when in the directory containing the
`.envrc` file or any of its child directories. Therefore, create a `.envrc` in the
directory one level above the datalab repository's directory on your machine (helps
avoid accidentally committing the file).

Set your `.envrc` file to be (replacing `VM_IP` with the development environment IP address (or `10.0.2.2`
for if using VirtualBox gateway)):

```bash
export AUTHORISATION_SERVICE_FOR_INGRESS=http://<VM_IP>:9000
export DEPLOYED_IN_CLUSTER="false"
export KUBERNETES_API=http://<VM_IP>:8001
```

Note if using k3s then add the following in addition;

```bash
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
```

(These environment variables are explained in more detail below).

When you cd into the .envrc folder (or one of its children), you should see

```bash
direnv: loading /.envrc
direnv: export +AUTHORISATION_SERVICE_FOR_INGRESS +DEPLOYED_IN_CLUSTER
```
### k3s

In this folder:

```bash
# Follow quick start guide here to set up k3s, but make sure
# to disable traefik and use nginx
# https://docs.k3s.io/quick-start
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--disable traefik" sh -s -
sudo chown -R $(id) /etc/rancher/k3s/

# Deploy the ingress-nginx Helm Chart
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install ingress-nginx ingress-nginx/ingress-nginx -n ingress-nginx --set controller.ingressClassResource.default=true --set controller.watchIngressWithoutClass=true

# Create devtest namespace
kubectl apply -f ./config/manifests/minikube-namespace.yml

# k3s includes its own default Storage Class - 'local-path'
# Create PVC
kubectl apply -f ./config/manifests/k3s-pvc.yaml

# Create compute submission cluster role
kubectl apply -f ./config/manifests/minikube-compute-submission-role.yml
```

### minikube

In this folder:

```bash
# Use VirtualBox as the driver, as ingress will expect the VirtualBox IP addresses
minikube config set driver virtualbox

# Check for running minikubes - stop any which use the IP 192.168.99.100
minikube profile list

# Ensure default IP addresses are used.
# This is required even when re-starting minikube clusters which previously had the right IP.
rm ~/Library/VirtualBox/HostInterfaceNetworking-vboxnet0-Dhcpd.*

# Create with enough disk space to allow pulling of notebook images, creating conda environments etc.
minikube start --disk-size='40gb' --cpus=3 --memory='6gb'

# Check the minikube IP is 192.168.99.100
minikube ip

# Create devtest namespace
kubectl apply -f ./config/manifests/minikube-namespace.yml

# Set default namespace (replace 'minikube' with your minikube name)
kubectl config set-context minikube --namespace=devtest

# Create Gluster and NFS storage classes
minikube addons enable storage-provisioner
kubectl apply -f ./config/manifests/minikube-storage.yml

# Create PVC
kubectl apply -f ./config/manifests/minikube-pvc.yml

# Create compute submission cluster role
kubectl apply -f ./config/manifests/minikube-compute-submission-role.yml

```

### Docker Desktop

If using Docker Desktop with Kubernetes instead of minikube, there are some alternative steps to the ones listed above.

To get the IP address, run:
```bash
kubectl get nodes -o wide
```

Which will return something like:
```
NAME             STATUS   ROLES    AGE   VERSION  INTERNAL-IP   EXTERNAL-IP  OS-IMAGE  KERNEL-VERSION CONTAINER-RUNTIME
docker-desktop   Ready    master   ...  ...       192.168.65.3  ...          ...       ...            ...
```

Change the IP addresses in `./config/dnsmasq/datalab-dnsmasq.conf` to the value beneath `INTERNAL-IP`.

The majority of the manifests can be `apply`ed as above, with the exception of the `minikube-storage.yml`,
which should be replaced with `./config/manifests/docker-desktop-storage.yml`.
This changes the provisioner to Docker, instead of minikube.

In addition, the default context name is `docker-desktop`, instead of `minikube`.

### dnsmasq

Follow the instructions in [config/dnsmasq](config/dnsmasq).

### Wildcard DNS & Certificate Authority

Chrome and FireFox will resolve sub-domains on the localhost domain (i.e. `*.localhost`) to
the host machine; other browsers may not respond the same way. If a domain other
than `*.localhost` is used for local development a local DNS must be set-up to
resolve from a browser. See README in `./config/dnsmasq`.

Development TLS certificates have been generated and stored in the `./config/ca` directory.
These provide TLS certificates for the `*.datalabs.localhost` domain.

* Open `keychain access` and from Finder drag `./config/ca/rootCA.pem` file into window
* Double click the newly install DataLabs certificate and set trust to `Always Trust`
* FireFox doesn't use the machine's trusted certificate authorities by default. An option
  needs to be turned on in Firefox to make this happen. This can be done by entering
  `about:config` into the address bar and then setting `security.enterprise_roots.enabled`
  to true ([reference](https://support.mozilla.org/en-US/kb/setting-certificate-authorities-firefox)).

The Client API might give SSL/TLS errors when trying to communicate with services running within minikube.
If this is the case, provide node the path to the `rootCA.pem` file using the environment variable `NODE_EXTRA_CA_CERTS`.
If you are running the client api with docker, the pem file will need to be mounted into the container and the value of `NODE_EXTRA_CA_CERTS` will need to be the path to the pem file from within the container.

### Enabling access to cluster from host machine

There are two domains through which you can access the cluster from the host machine (once configured) that configuration information is provided for.
For MacOS, you can configure access to be through `.datalabs.internal` (see [datalabs-internal-setup.md](./datalabs-internal-setup.md)).
For Linux, you can configure access to be through `.datalabs.localhost` (see [datalabs-localhost-setup.md](./datalabs-localhost-setup.md)).

### Configuring ingress auth

When notebooks etc. are created, an ingress rule is added such that they can be accessed.
The ingress rule contains a URL to check that the user accessing the resource has permission to view it which is expected to be the URL of the auth service.
The infrastructure api (responsible for creating the ingress) and the auth service are not running in the cluster, but the dynamically created notebooks are created within the cluster.
Therefore, the URL of the auth service is different for the infrastructure service and the notebooks.
The URL that is used in the ingress rule can be configured using the following environment variable

```bash
AUTHORISATION_SERVICE_FOR_INGRESS=<url-to-access-auth-service>
```

where `<url-to-access-auth-service>` needs to be configured to use the IP address and port through which a service in the cluster can access the authorisation service running on `localhost`. This can be found through;

 ```bash 
kubectl get nodes -o wide
``` 

From VirtualBox, this is expected to be `http://10.0.2.2:9000` as `10.0.2.2` is the IP through which items running in VirtualBox can access the host machine, and the auth service is configured to run on port `9000` by default.

### Correctly resolving and accessing notebooks

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

### NodeJS packages

In the `code` directory:

```bash
yarn
```

This will install all the
packages required for services within the workspaces.

Git-hooks (via husky) will enable when running the install step above. This will
enforce linting rules for any files being staged. Any errors highlighted will
need to be address before the git commit will be permitted. This rule checking
may be disabled using the `--no-verify` flag with `git commit`, this is not
recommended as linting error will still be caught with the CI server.

## Running

* Install docker-compose if not installed already

```
 sudo curl -SL https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
 ```

* Start minikube proxy, in separate terminal

```bash
kubectl proxy --address 0.0.0.0 --accept-hosts '.*'
```

*  Ensure that the Kubernetes API setting is configured correctly as per below.

```bash
# For Mac the setting should be the following;
KUBERNETES_API: http://host.docker.internal:8001
# For Linux it will be the same IP Address that is found
# when doing
# kubectl get nodes -o wide e.g
KUBERNETES_API: http://192.168.1.60:8001
```

- Once configured Start Mongo, DataLab App, DataLab Api, Infrastructure Api and Auth services.
Depending on using Minikube or K3s the following command should the be run.

```bash
# Minikube (including extra proxy)
docker-compose -f ./docker/docker-compose-mongo.yml -f ./docker/docker-compose-mongo-import.yml -f ./docker/docker-compose-app.yml -f ./docker/docker-compose-proxy.yml up
# K3s
docker-compose -f ./docker/docker-compose-mongo.yml -f ./docker/docker-compose-mongo-import.yml -f ./docker/docker-compose-app.yml up
```

You should eventually see a message from the web-app saying `You can now view datalab-app in the browser.`

Note:

* The services can be run in the background by running docker-compose with the -d flag.
* If you want to maintain the state of your previous run, omit `docker-compose-mongo-import.yml`.

### Running with Keycloak

If you wish to use a local authentication provider rather than auth0 to test this is possible by the following modifications to the `./docker/docker-compose-app.yml` file;

* Unhash the lines in the auth service marked as "`OIDC_*`".
* Hash out the line in the app service relating to `web_auth_config.json` and unhash the next line containing `web_auth_config_keycloak.json`.

Keycloak must be resolvable both by the auth service as well as your local desktop, as keycloak is addressable by default using the docker network by its service name, the easiest way to make it work locally is to add a local DNS entry or a localhost entry for keycloak e.g;

```bash
127.0.0.1 keycloak
```

Finally, use the following command to start the app in place of the final one used above. When setting up for the first time it may take a minute before login is available as the OIDC client is set up for the first time.

```bash
docker-compose -f ./docker/docker-compose-mongo.yml -f ./docker/docker-compose-mongo-import.yml -f ./docker/docker-compose-app.yml -f ./docker/docker-compose-proxy.yml -f ./docker/docker-compose-keycloak.yml up
```

### Accessing the database

By default, you can access the development database using a tool such as Robo 3T with authentication:

* User name: datalabs-root-u
* Password: datalabs-root-p
* Auth mechanism: SCRAM-SHA-256

## Local Helm install

It is also possible to deploy DataLabs locally using Helm.
This is not well suited for local development as you cannot change files within the DataLabs containers deployed with this mechanism.
However, it is useful when testing the Helm chart configuration.
A script exists at `./scripts/helm-install-datalabs-locally.sh` which will create the necessary secrets within minikube for the Helm install to work (note that this builds off of the items that have already been installed into minikube such as the storage classes etc.).
There are values that can be used to configure the installation at the top of the script, some of which will need to be set before first use.
It also assumes that the `datalab-k8s-manifests` repo is checked out parallel to this (`datalab`) repo.

```bash
kubectl delete -f ./config/manifests/minikube-proxy.yml # remove if applied from above instructions
./config/dnsmasq/configure-dnsmasq.sh datalabs.internal <ingress-nginx-controller external ip>
minikube tunnel # run this in a different terminal
./scripts/helm-install-datalabs-locally.sh

# if you want to re-install helm, do the following and wait for pods to terminate
helm uninstall datalab -n devtest
```

**Warning:** Before running this script ensure that your `kubectl` is configured to operate on the correct cluster.
`kubectl` is used throughout the script to create new secrets etc.

If you require access to the services running in the cluster, you may need to deploy an ingress controller.
Details of this are covered in [datalabs-internal-setup.md](datalabs-internal-setup.md) from the "Install ingress controller for minikube" section onwards.

## Testing APIs

The [Insomnia Rest client](https://insomnia.rest/) is recommended for testing APIs
during development. Detailed instructions for how to do this can be found
[here](./insomnia/README.md) including a definition file that can be imported.

## Telepresence

[Telepresence](https://www.telepresence.io/) can be installed, allowing you to e.g. investigate issues on the test system which you cannot reproduce locally.

### auth-service

```bash
cd datalab/code/workspaces/auth-service
kubectx datalabs
telepresence --expose 9000:9000 --swap-deployment datalab-auth-deployment
export AUTHORISATION_PERMISSIONS=${PWD}/resources/permissions.yml
export PRIVATE_KEY=${PWD}/resources/private.pem
export PUBLIC_KEY=${PWD}/resources/public.pem
yarn start
```

### infrastructure-api

```bash
cd datalab/code/workspaces/infrastructure-api
kubectx datalabs
telepresence --expose 8000:8000 --swap-deployment infrastructure-api-deployment
yarn start
```

### client-api

```bash
cd datalab/code/workspaces/client-api
kubectx datalabs
telepresence --expose 8000:8000 --swap-deployment datalab-api-deployment
yarn start
```

### web-app

```bash
cd datalab/code/workspaces/web-app
kubectx datalabs
telepresence --expose 3000:80 --swap-deployment datalab-app-deployment
yarn start
```

## Running Mock GraphQL Server

A Mock GraphQL server can be run in place of the real Client API GraphQL server. This automatically generates responses
to queries using canned data. To start the mock server run the following command in the `code/workspaces/client-api`
directory.

```bash
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

```bash
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

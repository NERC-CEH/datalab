# `datalabs.internal` Setup

**Note:** All commands in this document assume that they are being executed from same directory as this document i.e. `code/development-env/datalabs-internal-setup.md` from the repository root.

## Disable Minikube ingress

This approach uses nginx for ingress, so you need to disable the minikube ingress addon.

```bash
minikube addons disable ingress
```

## Install DNSMasq

A tool named DNSMasq is required to resolve the `*.datalabs.internal` requests to the IP address through which minikube is accessible.
On Mac, it can be installed using [homebrew](https://brew.sh/) with

```bash
brew install dnsmasq
```

## Install Helm

Helm is a Kubernetes package manager. It can be installed using homebrew with

```bash
brew install helm
```

Ensure that the installed version is `v3.0` or greater using

```bash
helm version
```

## Create TLS secret

To handle HTTPS requests to items running the cluster, we need to configure TLS certificates.
The first step of this is to create a TLS secret in our minikube cluster in the `devtest` namespace which will later be used in the ingress.

```bash
kubectl delete secret tls-secret
kubectl create secret tls tls-secret --key ./config/ca/datalabs.internal.key --cert ./config/ca/datalabs.internal.crt -n devtest
```

## Install ingress controller for minikube

Due to the need to configure the arguments of the ingress controller, it is not possible to use the minikube ingress addon.
Therefore, the ingress is installed using the [`ingress-nginx` helm chart](https://kubernetes.github.io/ingress-nginx/deploy/#using-helm).
Ensuring that `kubectl` is configured to operate in the `devtest` namespace (by e.g. using `kubens`) run the following commands.

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

helm install ingress-nginx ingress-nginx/ingress-nginx --values ./config/ingress/config.yaml -n devtest
```

The `config.yaml` adds extra configuration to the deployed ingress.
It is used to configure a default TLS secret to be used for all ingress rules that don't have their own TLS configuration. By default, this is set to `devtest/tls-secret` to point to the secret named `tls-secret` in the namespace `devtest` created earlier in [Create TLS secret](#create-tls-secret).
If the name of the TLS secret or the namespace it has been created in is different to that specified in the earlier command, the `config.yaml` needs to be updated to point to the appropriate secret.

**Note:** The [NGINX install page](https://kubernetes.github.io/ingress-nginx/deploy/) provides other ways of installing the same controller for different environments e.g. docker for Mac.
If you are able to use one of these and still set the `--default-ssl-certificate` command on the deployed ingress controller, this might be a better solution.

## Install ingress manifests

Make the following changes to [`./config/manifests/minikube-proxy.yml`](./config/manifests/minikube-proxy.yml):

- Update all values referring to `datalabs.localhost` to `datalabs.internal`
- Ensure the `externalName` field of both the `datalab-app-proxy` and `datalab-api-proxy` services is the IP at which a service running within minikube can access services running on your machine's `localhost`.
  This is expected to be `10.0.2.2` when running minikube with Virtualbox.
  This assumes that both the app and api are running and can be accessed on `localhost`.

Once the changes have been made, apply the manifests using

```bash
kubectl apply -f ./config/manifests/minikube-proxy.yml
```

## Start Minikube tunnel

At this point, the minikube cluster should be configured correctly in order to receive requests.
However, the entry point for requests into the cluster (the `LoadBalancer` service `ingress-nginx-controller`) doesn't have an externally accessible IP address as can be seen when running the following command (the `EXTERNAL-IP` column should read `<pending>` or `<none>`).

```bash
kubectl -n devtest get services
```

To get an external IP, the `minikube tunnel` command can be run.
This will assign an IP address to each `LoadBalancer` service in the cluster that is accessible from the host machine.
The command needs to be run in a new terminal window as it need to run continuously to provide the external IP.

After running `minikube tunnel`, you see an output similar to the following.
The key things are that it has picked up the `ingress-nginx-controller` `LoadBalancer` and there are no errors.

```text
Status:
      machine: minikube-datalabs-vb
      pid: 26710
      route: 10.96.0.0/12 -> 192.168.99.138
      minikube: Running
      services: [ingress-nginx-controller]
  errors:
      minikube: no errors
      router: no errors
      loadbalancer emulator: no errors
```

Rerunning `kubectl -n devtest get services` should now show an external IP related to the `ingress-nginx-controller` `LoadBalancer`.
This external IP is how we will access the services running in the cluster.
If you enter the IP address into a web browser, you should be served an NGINX 404 default backend page.

## Configure DNSMasq

We need to resolve the `datalabs.internal` domain to the external IP of the ingress `LoadBalancer`.
For this, we will use `dnsmasq` (which can be installed using `brew install dnsmasq` on Mac).

There are two ways of configuring `dnsmasq`.
For both approaches, we are aiming to configure the `datalabs.internal` endpoint to resolve to `10.110.232.162` which, in this example, is the external IP of the ingress `ingress-nginx-controller` `LoadBalancer` as given in the following output of `kubectl -n devtest get services`.

```text
NAME                                 TYPE           CLUSTER-IP       EXTERNAL-IP      PORT(S)                      AGE
datalab-api-proxy                    ExternalName   <none>           10.0.2.2         8000/TCP                     5d22h
datalab-app-proxy                    ExternalName   <none>           10.0.2.2         3000/TCP                     5d22h
ingress-nginx-controller             LoadBalancer   10.110.232.162   10.110.232.162   80:31888/TCP,443:31269/TCP   3d1h
ingress-nginx-controller-admission   ClusterIP      10.104.184.182   <none>           443/TCP                      3d1h
```

### Method one (recommended)

A shell script `configure-dnsmasq.sh` has been written to automate the steps necessary to configure DNSMasq.
This accepts two arguments (in the given order):

1. the domain name that should be resolved to the desired IP e.g. `datalabs.internal`
1. the IP address that should be resolved to when entering the domain name.

To configure `dnsmasq` as desired for the scenario given at the start of this section ([Configure dnsmasq](#configure-dnsmasq)), run the following commands from the `development-env` directory:

> **Warning:** This overrides any current `dnsmasq` configuration.
> Do not use this method if you need to maintain any existing `dnsmasq` configuration.
> Alternatively, update the `configure-dnsmasq.sh` to write the configuration you require.

```bash
chmod u+x ./config/dnsmasq/configure-dnsmasq.sh
./config/dnsmasq/configure-dnsmasq.sh datalabs.internal 10.110.232.162
```

When running the `configure-dnsmasq` script you will be asked to enter your `sudo` password (your login password on Mac).
This allows for:

- writing a file to `/etc/resolver` so the Mac's default dns resolver knows to use `dnsmasq` for this host.
- restarting of `dnsmasq` to pick up configuration changes.

### Method two

These are the same steps conducted in the `configure-dnsmasq` script but due to them being done manually, you can avoid overwriting any existing dnsmasq configuration that needs to be retained.

Ensure there is the file `/etc/resolver/datalabs.internal` with the contents

```text
nameserver 127.0.0.1
```

This can be achieved with

```bash
sudo bash -c 'echo "nameserver 127.0.0.1" > /etc/resolver/datalabs.internal'
```

Edit [`./config/dnsmasq/datalab-dnsmasq.conf`](./config/dnsmasq/datalab-dnsmasq.conf) such that the entry regarding `datalabs.internal` is pointing at the external IP of the ingress.
For the given example, the line in the DNSMasq config should read

```text
address=/datalabs.internal/10.110.232.162
```

Copy the config file to where the brew installed `dnsmasq` can find it

```bash
cp ./config/dnsmasq/datalab-dnsmasq.conf "$(brew --prefix)/etc/dnsmasq.conf"
```

Restart `dnsmasq` to pick up the changes

```bash
sudo brew services restart dnsmasq
```

You may need to start the service first by replacing `restart` with `start` in the above command.

### Ensure `datalabs.internal` is resolved correctly

You can ensure that `datalabs.internal` is being resolved correctly by running

```bash
ping datalabs.internal
```

The output should show the IP address that `datalabs.internal` is being resolved to such as in the following. Don't worry about the request timeout if you see it. You may need to restart your Mac for the changes to be picked up.

```text
$ ping testlab.datalabs.internal
PING testlab.datalabs.internal (10.110.232.162): 56 data bytes
```

Further information can be seen using

```bash
scutil --dns
```

## Set environment variable

The following environment variable should be set:

```bash
DATALAB_DOMAIN=datalabs.internal
```

This can be done in the direnv .envrc file, if you are using direnv.

## Ensure access to app

At this point, it should now be possible to access the web-app through the `datalabs.internal` domain.
With the web-app running on `localhost` (e.g. through running the development docker-compose file), try accessing [https://testlab.datalabs.internal/] (this was configured in the ingress we applied earlier to resolve to the web-app).
This should access the DataLabs web-app.

Upon logging into the app, you may be redirected to the wrong address `datalabs.localhost`.
To resolve this issue, the appropriate `web_auth_config.json` file needs to be updated such that references to `datalabs.localhost` are replaced with `datalabs.internal`.
The location of this file depends on the way in which you are running the system; for the docker-compose method the relevant file is at `./config/local/web_auth_config.json`.
At this point, everything is in place to access the app at `datalabs.internal`.

The remaining issues are a case of needing to update the app configuration to look in the correct places.
As this is a more generic problem that the one being covered in this guide, that information is contained in the main [README.md](./README.md) file.

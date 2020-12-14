# Deployment View

This section details the datalabs architecture from the view-point of its deployment.

## Containerisation vs Virtualisation

The core requirement of Datalabs is runtime flexibility. The intention is to provide a
rich, dynamic environment to users. Two options were considered, containerisation and
virtualisation ([ARD-0005](../decisions/0005-docker-containers-for-everything.md)). The
decision was to adopt a containerisation approach as fast starting containers with a
more flexible resource sharing model is a much closer match to the datalabs vision.

While we anticipate using Docker containers wherever possible this does not rule out the
option of using virtual machines for specific use cases. One possibility is to provide
users with Desktop as a Service as serving a desktop from a container is unlikely to work
well.

## Kubernetes

Docker and containerisation provide an easy way to package code with its
dependencies to allow easily deployable pieces. This encourages the separation of the
system into smaller, easier to deploy pieces requires a way to orchestrate the containers
across the available resources. [Kubernetes](https://kubernetes.io/) is a container
orchestration tool that provides abstractions over the core pieces required to deploy
a system.

There is a [Kubernetes primer](#kubernetes-primer) at the end of this section.

## Deployment Structure

Datalabs is deployed in three different layers and a variety of tools are used in the
process:

* **Infrastructure Layer** - Datalabs is deployed into an OpenStack tenancy provided and
supported by STFC. Servers are provisioned with appropriate networking and storage
using Terraform.
* **Platform Layer** - This layer has Kubernetes at its heart, but also includes load
balancers, a Gluster storage cluster and a bastion server. The full software installation
across all of these servers is managed via Ansible scripts.
* **Application Layer** - Datalabs is deployed as Docker containers into a fully
configured Kubernetes cluster that has ingress and storage fully configured. Deployment
is done using Helm.

## Environment Handling

Multiple environments are required for datalabs to support ongoing development while
providing a stable production environment. Ideally these two environments would be
completely isolated but due to the complexity of managing Kubernetes and Gluster clusters
there is only a single multi tenant environment. Two instances of Datalabs are separated
into two namespaces, `prod` and `test`. Each namespace shares an ingress controller and
there are two external load balancers. Storage is dynamically
provisioned through a single Gluster cluster.

## Kubernetes Primer

Kubernetes provides abstractions over all of the pieces required to run an application.
Datalabs makes use of many of these and this section describes those in use. Kubernetes
is a hugely complex tool that sits at the core of datalabs so this should only be
considered a primer.

#### Container

A `container` is a single application container that performs a specific function.
Kubernetes supports multiple container runtimes but we only use Docker containers.

#### Pod (PO)

A `pod` is a collection of containers that run together as a single unit. Containers
running in the same pod share underlying storage and network resources and are able to
both mount the same volumes and communicate on a localhost network. Many Datalabs pods
only run a single container but there are a number of cases where multiple containers
are run in the same pod. All containers within a single pod are addressable at the same
IP address.

One use case for running multiple containers in a pod is to transparently enrich the
capability of the main workload. An example is the `kubectl abassador` container for the
Infrastructure API that handles authentication and authorisation for communication with
the Kubernetes API.

Pods have `resource limits` assigned to specify how much of the underlying cluster
resource they are allowed to consume. It is essential that these limits are always
specified as the default behaviour is unbounded and run away containers could case the
cluster to panic.

#### Liveness and Readiness Checks

Two types of checks can be specified for containers. Once a container has been started,
Kubernetes will probe the `readiness` check until the service reports that it is ready to
receive traffic. Only once this check is passed will Kubernetes route traffic to it.

Once the service is ready, Kubernetes will periodically probe the `liveness` check to
ensure the the service is still healthy. If a service fails a liveness check, Kubernetes
will kill the pod and reschedule it. This means that it is important to think carefully
about what it means to fail a liveness check in order to avoid cascading failure.

#### Deployment

A `deployment` specifies how a pod should be deployed along with associated metadata. In
a deployment manifest is possible to specify that multiple replicas of a pod should be
run. These can be distributed across the cluster providing resilience in the case of
failure.

#### Service (SVC)

Pod IP addresses are assigned at runtime by Kubernetes. This means that it is impossible
to know in advance what IP address a specific Pod will be running at. In the case where
multiple replicas of a pod are being run there may be several IP addresses and in
addition these will change if a pod dies and is rescheduled. It is necessary to provide
a discovery mechanism to allow pods to collaborate and Kubernetes does this through a
`service`.

A `service` provide an endpoint that is fixed to a known location and then load balances
requests across all of the pods that have matched the selector for the service.

Services are addressable either by name (via cluster DNS) from within the same namespace
or via their longer DNS name from across namespaces. The cluster DNS name is of the
form `<service-name>.<namespace-name>.svc.cluster.local`.

> Note: that due to bugs in Kubernetes DNS some entities do not get correctly supplied
with cluster DNS and is is necessary to reference pods directly by IP address. The only
known datalabs example if this is the Gluster storage class.

#### Secrets

Applications require secrets at runtime to perform certain actions. Examples include
database credentials, SSL certificates and API keys. Kubernetes provide `secret`s that
allow the secret values to be stored in the cluster as base64 encoded strings but only
accessible to users with the appropriate credentials. Secrets can then be mounted into
containers at runtime either as environment variables or as files on disk as required.
In addition, some Kubernetes abstractions can directly reference secrets (e.g. for SSL
certificates in ingress). All of these approaches are used in datalabs.

#### Overlay network

A Kubernetes cluster is comprised of a number of virtual machines that are assigned IP
addresses as the are created. In order to allow containers running on the Kubernetes
cluster to communicate, it is necessary to allocate an IP address to each pod as it
starts. Clearly this can't be on the same range as the cluster nodes and to solve this
problem an `Overlay Network` is used. This allows the kubernetes scheduler to assign
IP addresses from a different range and then manage inter node communication on the
overlay network translating back to the main network to jump between hosts.

There are many competing Kubernetes overlay networks. Datalabs uses the
[WeaveNet](https://www.weave.works/docs/net/latest/kubernetes/kube-addon/) network as
this is easy to install and transparent to use.

#### Ingress Rules (ING)

The cluster network allows communication within the network, but it is necessary to
bridge into this network from the outside to allow users to access services. An `Ingress`
is a collection of rules that specifies how an inbound connection should be routed to
cluster services.

It is possible to route based on domain and path and a single rule can support multiple
routes. It is also possible to terminate SSL connections at the ingress controller
meaning that individual services don't have to handle SSL termination.

#### Ingress Controller

In order for ingress rules to operate it is necessary for the cluster to have one or
more `Ingress Controllers`. Kubernetes does not provide an implementation of an ingress
controller so Datalabs makes use of the
[Nginx Ingress Controller](https://kubernetes.github.io/ingress-nginx/).

Different implementations of ingress controllers provide additional functionality through
annotations and a small number of Nginx specific annotations are in use in Datalabs to
provide authentication and authorisation checks across all services (including third
party).

The Ingress Controller is deployed into the kube-system namespace in order for it to
fullfill all ingress rules and route traffic to any required namespace (see below).

#### Storage Class (SC)

A `Storage Class` provides a definition of storage that can be used dynamically within
the cluster. This abstraction allows all consumers of storage to operate without
requiring knowledge of the exact storage mechanism provided.

In the case of Datalabs, storage is provided through Gluster and Kubernetes manages the
volumes dynamically through the Heketi API.

> Note: Due to a Kubernetes bug, the storage class refers to the Heketi API by IP address
causing it to fail if the Heketi pod is rescheduled. This can be resolved by recreating
the storage class and this does no affect underlying volumes.

#### Persistent Volumes (PV)

A `Persistent Volume` is a storage resource that can be bound to a pod. These can be
created dynamically through a storage class or statically by an administrator.

All Datalabs volumes are dynamic.

#### Persistent Volume Claims (PVC)

In order to bind a persistent volume to a pod it is necessary to create a `Persistent
Volume Claim`. This marks the fact that a volume has been assigned to a pod and ensures
that in the case where a pod is rescheduled, the underlying persistent volume will not
get assigned to another pod unless the claim is also released.

If a PVC is created without a corresponding PV then in the case of dynamic storage a PV
will be automatically created.

#### Init Containers

In some cases it is necessary to perform some initialisation actions before the main
workload of a pod is started. Examples of this include setting folder permissions or
waiting for another service to be available. `Init Containers` run prior to the main
containers and can be used to perform these sorts of actions.

The busybox container is very lightweight and provides most of the UNIX tools so is very
useful as an init container.

#### Namespace (NS)

A Kubernetes cluster can support many different applications at the same time and
`Namespaces` provides a mechanism to ensure isolation between them. The majority of
Kubernetes resources get placed into a namespace and all simple DNS resolves within the
context of a namespace.

It is possible to apply access restrictions and network restrictions (through `Network
  Policies`) at the namespace level to enforce isolation.

#### Role Base Access Control (RBAC)

Kubernetes provides a rich `Role Based Access Control` framework that allows fine grained
control over access to cluster resources. These can be applied at either namespace level
using `Role`s and `Role Bindings` or at the cluster level using `Cluster Roles` and
`Cluster Role Bindings`.

Roles can be bound to `Service Account` and these can then be assigned to Pods to provide
access to resources if required.

RBAC is used in a number of different areas throughout datalabs. The main usage is to
provide the infrastructure API access to the Kubernetes API by assigning a service
account that can managed Kubernetes resources.

# Process View

This section details the platform architecture from the view-point of its dynamic processes.

## Stack Creation

Stack creation and deletion is an asynchronous process. User requests are marshalled
directly to Kubernetes but once a state has been defined is can take a period of time
before a container is ready to serve traffic.

Pods indicate their ready status through `Readiness` checks that all services expose and
changes in state are published to the Kubernetes `Event` stream. This allows the
`Kube Watcher` container to monitor for the state changes and update the state of the
stack in the Mongo database for the Infrastructure API.

Available states for the pods are:

* Requested - User request accepted but no resources yet in Kubernetes
* Creating - The resources have been created but are not yet ready
* Ready - The resources are ready and the readiness check has passed
* Unavailable - The resources have failed their health check and are unavailable

Events published to the event stream are ephemeral and are only available to subscribers
listening at the time the event was published. This means that if the Kube Watcher fails
it is possible to miss events and be out of sync with the real state of the cluster. To
resolve this problem the watcher performs a regular state synchronisation by querying the
Kubernetes API for current pod status.

> Note: It would have been possible to retrieve the state of Pods directly from the
Kubernetes API at user query time but this would not have extended to resources managed
outside of Kubernetes (e.g. Virtual Machines) so an internal state store was used.


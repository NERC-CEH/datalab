# Unable to create gluster volumes

There is an error seen when the heketi db volume has not been mounted onto the
heketi pod. This prevents creation of new gluster volumes.
A `kubectl describe` of the heketi pod shows the events below:

``` bash
Events:
  Type     Reason       Age                      From                          Message
  ----     ------       ----                     ----                          -------
  Warning  FailedMount  48m (x2793 over 19d)     kubelet, datalabs-k8s-node-3  Unable to attach or mount volumes: unmounted volumes=[db], unattached volumes=[config heketi-service-account-token-ls4fl db]: timed out waiting for the condition
  Warning  FailedMount  13m (x2815 over 19d)     kubelet, datalabs-k8s-node-3  Unable to attach or mount volumes: unmounted volumes=[db], unattached volumes=[heketi-service-account-token-ls4fl db config]: timed out waiting for the condition
  Warning  FailedMount  7m42s (x13694 over 19d)  kubelet, datalabs-k8s-node-3  MountVolume.SetUp failed for volume "db" : stat /var/lib/kubelet/pods/25cba6ac-f221-42c7-9749-fe7cbb661999/volumes/kubernetes.io~glusterfs/db: transport endpoint is not connected
  Warning  FailedMount  2m57s (x7933 over 19d)   kubelet, datalabs-k8s-node-3  Unable to attach or mount volumes: unmounted volumes=[db], unattached volumes=[db config heketi-service-account-token-ls4fl]: timed out waiting for the condition
```

A restart of the heketi pod can be done to fix this as below:

```bash
kubectl delete po $HEKETI_POD
```

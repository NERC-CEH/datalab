# Pods stuck in terminating state

When a pod is rescheduled, the old replica may get stuck in a terminating
state. A `kubectl get` of pods in a such a situation would be for example:

``` bash
$ kubectl get pods -A | grep Terminating
alextest         jupyterlab-dasktestnotebook-857c896999-7rr22                0/1     Terminating             0          22d
alextest         zeppelin-anothernotebook-5d9f4784f5-xf55l                   0/2     Terminating             0          21d
iainproj         jupyterlab-dasktest-79877bd58-c5vfb                         0/1     Terminating             0          27d
iainproj         minio-iainstore-6f686b4f9b-sbzbp                            0/2     Terminating             0          28d
```

If it's satisfied that a replica pod has been scheduled succesfully,
the pod in terminating state can be cleaned up with:

```bash
kubectl delete pod <pod> -n <namespace> --grace-period=0 --force
```
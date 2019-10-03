# Docker data drive not mounted

By default the servers provided by OpenStack for the instance size used by Datalabs are
only provisioned with a 16Gb drive. This is insufficient to store the large Notebook
images that Datalabs uses.

To resolve this issue, all servers are provisioned with a second 100Gb drive and Docker
is configured to use this instead of the default location for images.

In the case where the drive has not been mounted, the directory will be created by Docker
and it will work without issue until the root drive reaches 85% capacity causing a
Kubernetes panic and wide spread pod evictions.

This issue can be resolved by the following steps

1. Cordon the node `kubectl cordon <node-name>`.
1. Drain the node `kubectl drain <node-name> --ignore-daemonsets`.
1. Login to the node and elevate permissions `sudo su`.
1. Stop the kubelet and docker services.

    ```bash
    systemctl stop kubelet.service
    systemctl stop docker
    ```

1. Move the `/data` directory to `/data-old`.

    ```bash
    mv /data /data-old
    ```

1. Mount the drive using an ansible playbook.
1. Validate that the drive is mounted and registered in `/etc/fstab`.

    ```bash
    mountpoint /data
    less /etc/fstab
    ```

1. Clear the mounted drive if not empty (e.g. drive was mounted at some point previously) and then copy the `docker` directory to the now mounted `/data` directory.

    ```bash
    mv /data-old/docker /data
    ```

1. Restart the server `shutdown -r now`.
1. Once the server is started check the drive is still mounted and that the Kubelet and Docker services have restarted.

    ```bash
    systemctl status kubelet.service
    systemctl status docker
    ```

1. Uncordon the node `kubectl uncordon <node-name>`.
1. Check the node is ready `kubectl get nodes`.

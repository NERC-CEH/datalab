# Installation & Verification

DataLabs is deployed to Kubernetes using [Helm](https://helm.sh/).
There are several steps to deployment:

* [Install Helm](https://helm.sh/docs/intro/install/) if it is not already installed.
* Identify the version to deploy and confirm artifacts are published in DockerHub.
* Update the Kubernetes manifests for the appropriate environment.
* Deploy the updates using Helm.
* Watch the deployment
* Verify the deployment

## Identify and confirm the version to deploy

Once the repository CI is complete, ensure that the artifacts have all been published to [DockerHub](https://hub.docker.com/u/nerc/dashboard/) and are listed on the tags page.
Sometimes the artifacts do not appear immediately for download.

## Update the Kubernetes manifests and deploying

The [datalab-k8s-manifests](https://github.com/NERC-CEH/datalab-k8s-manifests) repository contains the necessary artifacts to deploy DataLabs.
The [README](https://github.com/NERC-CEH/datalab-k8s-manifests/blob/master/README.md) in that repository contains the information you need to be able to update and deploy DataLabs.

## Watch the deployment

It is possible to watch the status of pods in the cluster to see the old containers
stopping and the new ones starting. Depending on the scale of the change and the size of
the containers this can vary in time. To watch the pod status execute

```bash
kubectl get pods -n <namespace> --watch
```

## Verify the deployment

To verify the deployment:

* Hard refresh the DataLabs home page to ensure the expected version number is visible in the footer.
* Request the status of the [API](https://datalab-api.datalabs.nerc.ac.uk/status) and check that it returns the correct version.
* Test the functionality of the site focusing on the area of change.

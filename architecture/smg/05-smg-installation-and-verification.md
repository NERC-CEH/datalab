# Installation & Verification

Datalabs is deployed to Kubernetes using a custom deployment tool called *Bara*. There
are several steps to deployment:

* Build and install Bara if it is not already installed.
* Identify the version to deploy and confirm artifacts are published in DockerHub.
* Update the Kubernetes manifests for the appropriate environment.
* Deploy the updates using Bara.
* Watch the deployment
* Verify the deployment

## Build and Install Bara

The code for Bara lives in the repository and must be built and installed before use. The
code can be found in the `code/bara` directory and installation instructions are in the
`README.md` in the same directory.

Confirm correct installation with the `bara help` command.

## Identify and confirm the version to deploy

Once the repository has been tagged and the Travis build is complete. Ensure that the
artifacts have all been published to
[DockerHub](https://hub.docker.com/u/nerc/dashboard/) and are listed on the tags page. Sometimes the artifacts do not appear immediately for download.

## Update the Kubernetes manifests

The [datalab-k8s-manifests](https://github.com/NERC-CEH/datalab-k8s-manifests) repository
contains all of the deployment templates for datalabs. If performing a simple version
upgrade then only the configuration file for the appropriate environment needs to be
updated with the new version information. Currently, all datalabs containers are
deployed together so only the `datalabVersion` field needs to be updated with the new
verison.

If making more complicated changes then it may also be necessary to update the template
manifest files. These are written as [Mustache](https://mustache.github.io/) templates
with the replacement files being read from the configuration files. Note that the values
are HTML escaped by default so for some values the templates need to be escaped using the
`&` tag (see [documentation](https://mustache.github.io/mustache.5.html)).

## Deploy using Bara

To deploy using bara execute with the deploy keyword and the required templates and
configuration files. For example

```bash
bara deploy -t templates/datalab -c config/test.yml
```

## Watch the deployment

It is possible to watch the status of pods in the cluster to see the old containers
stopping and the new ones starting. Depending on the scale of the change and the size of
the containers this can vary in time. To watch the pod status execute

```bash
kubectl get pods -n <namespace> --watch
```

## Verify the deployment

To verify the deployment:

* Hard refresh the datalabs home page to ensure the expected version number is visible in the footer.
* Request the status of the [API](https://datalab-api.datalabs.nerc.ac.uk/status) and check that it returns the correct verison.
* Test the functionality of the site focusing on the area of change.

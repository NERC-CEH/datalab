# Creating a Release

All release artifacts are created following a successful build on any commit to the
master branch.

Development should be done in branches and merged to master through Pull Requests.
Whenever a pull request is opened, this triggers a build of both the branch and the
result of the merge of the branch to master. It is possible to merge with failing
checks but you should never do so.

Build status and in progress builds can be viewed:

* In Actions on [GitHub](https://github.com/NERC-CEH/datalab/actions).
* In Pull Requests on [GitHub](https://github.com/NERC-CEH/datalab/pulls).
* On the repository [home page](https://github.com/NERC-CEH/datalab)

## Versioning

Versioning is done via a combination of tags on the repository and [git describe](https://git-scm.com/docs/git-describe).

Tagging triggers a rebuild of all artifacts. Git tags must be [annotated](https://git-scm.com/book/en/v2/Git-Basics-Tagging)
with the same version before pushing to GitHub otherwise the version is not correctly
picked up.

## Releasing to the test environment

Below are some instructions for releasing a build to the test environment.
Using an ssh tunnel is recommended to make this easier, which is outlined in
the [design section](./02-smg-design.md) of the SMG.

There is some further information in the
[datalab-k8s-manifests](https://github.com/NERC-CEH/datalab-k8s-manifests)
repo, as that repo is used as part of this process.

1. Write code; Create pull request; Merge into master.
1. After merging, a new release of the Docker image should be created and can be found on
   [Docker Hub](https://hub.docker.com/r/nerc/datalab-app/tags?page=1&ordering=last_updated).
    * Get the Docker image tag of the correct build - to do this,
      compare the tag to the desired git commit, looking after the `g` in the tag.
    * For example, if your git commit hash starts with `abcd1234`,
      then the Docker tag might look something like `0.12.34-gabcd1234`.
1. Open the `datalab-k8s-manifests` repo and go to the `helm/datalab/Chart.yaml` file.
    Update the `appVersion` and increment the `version`.
1. Switch to the `datalabs` context in `kubectl`, i.e. `kubectx datalabs`.
1. Switch to the `test` namespace in `kubectl`, i.e. `kubens test`.
1. Run Helm to perform the release:
    * `helm dependency build ./helm/datalab/`
    * `helm upgrade datalab ./helm/datalab`
1. Check that the release is successful:
    * Inspect the pods with `kubectl get pods`.
    * Go to the test environment website to view the changes.
1. When happy with the changes, make a pull request in the `datalab-k8s-manifests`
    repo for the helm chart change.

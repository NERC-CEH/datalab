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

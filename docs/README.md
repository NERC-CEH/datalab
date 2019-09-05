# User Documentation

This sub-project houses the user documentation for DataLabs project. The
documentation is written in MarkDown and converted to static HTML pages to be
served to the user. These static pages are generated using
[mdBook](https://github.com/rust-lang-nursery/mdBook).

`mdBook` is a clone of the legacy GitBook written in rust; a standalone binary
is available and is utilised in the build pipeline to build a docker container
to serve the formatted user documentation. If installed the documentation my be
generated and served locally by running the `mdbook serve` command.

Linting of the MarkDown files is preformed by the NodeJS library
[MarkDownLint](https://github.com/DavidAnson/markdownlint), this may be run by
using the `yarn lint` command.

# User Documentation

This sub-project houses the user documentation for DataLabs project. The
documentation is written in MarkDown and converted to static HTML pages to be
served to the user. These static pages are generated using
[mdBook](https://github.com/rust-lang-nursery/mdBook).

`mdBook` is a clone of the legacy GitBook written in rust; a standalone binary
is available and is utilised in the build pipeline to build a docker container
to serve the formatted user documentation. If installed the documentation may be
generated and served locally by running the `mdbook serve` command.

Linting of the MarkDown files is preformed by the NodeJS library
[MarkDownLint](https://github.com/DavidAnson/markdownlint), this may be run by
using the `yarn lint` command.

## Structure

We plan to arrange the documentation into:

* Tutorials
* How-to guides
* Reference

see <https://documentation.divio.com/introduction/>.

**Exemplar:** docs/src/tutorials/README.md

## Content

Each page or section should have:

* An introduction - why am I here and what I am about to learn
* A middle - what do I need to do
* An end - what did I do, why (reinforcement messages) what might I do next.

**Examplar:** docs/src/tutorials/my-first-notebook/README.md

## Screenshots

Screenshots should be appropriately sized, around 900 x 530 pixels.
The **Version** at the bottom of the page shouldn't be showing.

**Examplar:** docs/src/img/create-storage-form.png

## Formatting

Adapting <https://docs.microsoft.com/en-us/style-guide/procedures-instructions/formatting-text-in-instructions>:

| Element | Formatting | Example |
| - | - | - |
| Elements | **Bold**, sentence-style caps. | Select **Create project**. |
| Command-line, code | Use mark-down back-ticks. | `env-control add myEnvironment` |
| First usage of a term | *Italics* | Here you will learn about *projects*. |
| Definition | **Bold** | **Project:** A project is a container for your storage and... |

In general, UI elements like 'button' and 'menu' should not be part of the documentation.

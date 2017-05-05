# GitBook Manual

This manual has been written in markdown and converted to static web pages using
[GitBook](https://github.com/GitbookIO/gitbook/). The contents of the
user/developer guides are stored in the `docs/` directory.

## Install GitBook

Install GitBook globally using npm.

`npm install gitbook-cli -g`

## Build static pages

The following instruction will build the manual as static web pages within the '_book/'
directory.

```
# within the docs directory
gitbook build
```

## Build and serve static pages

The following instruction will build the manual and serve it on [http://localhost:4000/](localhost:4000).
Serving a GitBook with an IDE or text editor open with active file watchers can cause
the server to crash. See _Increase number of file watchers permitted in linux_ in
[Data Lab Web Application](../datalab-app/README.md).

```
# within the docs directory
gitbook serve
```

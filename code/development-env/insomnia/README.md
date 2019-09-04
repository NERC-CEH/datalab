# Insomnia API definitions

This folder contains an [Insomnia](https://insomnia.rest/) definition for Datalabs API
endpoints. These can be imported into a desktop Insomnia client to allow endpoints to be
easily tested.

Note that any edits made using the Insomnia client will not automatically be applied to
the definition file. Instead, the updated version must be exported to this location.

## Importing a definition

To import a definition:

* Click on the `Workspace` drop down in the to left and select `Import/Export`.
* Click on the `Import Data` drop down and select `From URL`.
* Paste the URL `https://raw.githubusercontent.com/NERC-CEH/datalab/master/code/development-env/insomnia/datalabs-apis.yaml` or click the button below.

[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Datalabs&uri=https%3A%2F%2Fraw.githubusercontent.com%2FNERC-CEH%2Fdatalab%2Fmaster%2Fcode%2Fdevelopment-env%2Finsomnia%2Fdatalabs-apis.yaml)

If you have previously imported the definition then any new requests will be added to the
existing workspace. If you have local changes, it seems that Insomnia will leave these
untouched, though it might be sensible to save these first in case this behaviour
changes.

## Exporting a definition

To export a definition:

* With the Datalabs workspace selected, click on the `Workspace` drop down in the to left and select `Import/Export`.
* Click on the `Export Data` drop down and select `Current Workspace`.
* Leave all endpoints checked and click `Export`.
* Select `Insomnia v4 (YAML)` then `Done`.
* Select `No` on `Export private workspaces?`.
* Select the file to export to and then click `Export`.

## Environment Variables

The definition contains environment variables to allow reuse across endpoints. These are
specified in JSON through the `Environments` section that is found below the `Workspace`
title. Click `No Environment` then `Manage Environments` (⌘E on MacOS). Given some of
the variables are sensitive, they need to be locally overridden to set the correct values
using a `Sub Environment`. To do this:

* Click the `+` button next to `Sub Environments`
* Select `Private Environment` to ensure it is not exported later.
* Specify a name and colour
* Copy the complete environment from the base environment then remove anything that doesn't need to be changed leaving just the variables to be overridden before setting the required variables.

Once you have created the environment, select it from the `Environment` drop down.

## Tokens

> Note: It is recommended that while testing APIs locally the Auth Service `expiresIn`
time defined in `/auth-serice/src/config/auth.js` is extended from `2m` to a much
greater value to avoid internal tokens expiring quickly.

One of two different tokens is required for API access depending on which API it is. The
GraphQL client api requires an Auth0 `access_token` while all other APIs require an
`internal_token` from the Auth service.

To retrieve an `access_token` the only current way is to retrieve one from the web
application. To do this, open development tools, then go to
`Application`->`Local Storage`->`access_token` and copy the value. Note that right click
copy doesn't always copy the complete value so better to select it and copy from the
text area below.

The `access_token` is required to retrieve an `internal_token`. To do this, paste the
`access_token` into the `Private Environment` created as described in the
`Environment Variables` section above and then invoke the `Internal Authorise` endpoint
in the workspace by clicking `Send`. If successful, this should return a JSON document
that contains a token. This token is the `internal_token`. The value should be copied and
pasted into the `Private Environment`.

Once both tokens have been set all endpoint should be executable.

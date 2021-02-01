# Getting Help

## I'm having trouble logging into DataLabs

In order to login to DataLabs you'll need to create an account using the sign up button
from the home page. Once you've created an account, you'll need to verify your e-mail
before being able to sign in.

## I have signed in but can't see anything, what do I do now?

Initially, you will only be able to see projects which you own or have been given
access to. If you are expecting to collaborate on an existing project, ask one of the
project admins to give you permission to access the project. Otherwise, contact your
DataLabs instance administrator to request a project.

## Where do I get started having logged in with access to a project?

A number of [tutorials](../tutorials/) will be added over time which will help with
getting started within DataLabs.

## I am a project owner, how do I add more people to my project?

This is done from the project page and browsing to `Settings` in the sidebar, from here
you can type a users e-mail in the `Add User` field and assign them a permission.

Note that once you have added a user, what they will be able to do depends on the permission
that they have been assigned, a brief summary is below;

* Admin - Has control of adding and removing users to the project as well as creating
  data storage.
* User - Can create and control notebooks and sites but not storage.
* Viewer - Can only view sites that are created, has no ability to create any resources.

Note that the exception to this is if a user chooses to share their notebook with the entire
project, at this point every member of the project will be able to access it.

## I'm a user in a project but can't create a notebook

Once you are part of a project as a user you will have the permission to create notebooks,
but this may not be possible unless you have been assigned a data store to use. These are
created by admins under the `Storage` tab. In order to be able to create a notebook, ask an
admin to add you to a data store which you will be able to use.

## I've never used notebooks before, where can I find out more?

A number of notebooks are available in DataLabs, links to useful introductory documentation
for each of them can be found below.

* [JupyterLab](https://jupyterlab.readthedocs.io/en/stable/)
* [RStudio](https://rstudio.com/collections/rstudio-essentials/)
* [Zeppelin](https://zeppelin.apache.org/docs/0.6.0/quickstart/explorezeppelinui.html)

All of them share a common theme of providing a work environment where code can be run and
visualized, while also running on a platform that allows you to work collaboratively with others.

## I have noticed some things which are different about working in DataLabs than locally?

There are a few key differences to know about when working within DataLabs compared to locally.

The main one concerns how packages are installed and persisted. Within DataLabs your
runtime environment (i.e Python and R packages) must be stored alongside the code. Practically,
this means using tools such as [Conda environments](../tutorials/conda_environments.md)
or [Packrat](../r-libs/packrat.md).
  
## I am having problems which I can't find the answer to here, how do I get help?

We are active on [Slack](https://nerc-datalabs.slack.com/) and happy to discuss any
problems with you there where possible.

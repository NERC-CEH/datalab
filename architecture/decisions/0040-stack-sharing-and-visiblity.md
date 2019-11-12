# 40. Stack Sharing and Visibility

Date: 2019-11-12

## Status

Accepted

## Context

There is demand from the users to be able to "share" their Notebooks such that other users
are be able to open the Notebook, change some values and then re-run cells within the
Notebook.

There is also the requirement to be able to "share" the results of a notebook in a way
that involves less interaction from the viewer. This requirement is fulfilled by Sites,
but there needs to be a way to configure who is able to see the Site.

There is the need to define whether these are two truly separate concepts and how
"sharing" should be implemented in Datalabs.

## Decision

We have decided to split these into two different concepts: `sharing` and `visibility`.

`Sharing` is the means through which a user will allow others access to make changes to
the item that is being shared.

`Visibility` is the means through which a user will allow others to view the output of
their work.

It is possible for an item to have both a `sharing` and `visibility` status. For example,
a Site might have a `visibility` status that means anyone is allowed to look at the
content and it might also have a `sharing` status that anyone in the Project the Site
belongs to can edit the configuration of the Site.

## Consequences

The needs and desires of the user community should be met using this mechanism.

We will need to update the Mongo schemas for all items that are going to be able to
support having a `sharing` and `visibility` status and make this configurable from
the web-app.

We will need to educate the user community on the difference between the two ideas and
make sure that they are referred to in a consistent manner.

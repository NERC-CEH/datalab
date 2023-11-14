# How to Suspend and Restart Resources #

## Why suspend my resources in DataLabs? ##

When not in active use, notebooks, sites and clusters use a minimal amount of resources.
Suspending them frees up this resource to be used by others.

## What does suspending a resource do? ##

Suspending a resource temporarily shuts it down. No existing data or configuration is
lost. This takes a few minutes and will terminate the session of anyone using the
resources. Once suspended, the resource can be turned back on when required.

## Why are Notebooks automatically suspended? ##

Often people forget about resources they were previously working on. In order to prevent
these resources draining capacity, a basic timeout policy is enforced which will
automatically suspend *notebooks*. This comes into effect only if it has not been accessed
(by a user opening the resource through DataLabs) for some time.

**NOTE: This does not affect sites, which often sit idle for long periods of time for good
reason.**

## How will I know if a Notebook is about to be automatically suspended? ##

If a notebook has not been accessed in some time, a warning will be shown next to the
notebook in question.

![suspend warning](../../img/suspend-notebook-warning-example.png "suspend warning")

## Can I manually suspend resources myself? ##

This is possible via the ellipsis button on the respective resources. The following can be
manually suspended and restarted:

* Notebooks
* Sites
* Compute Clusters

![suspend notebook](../../img/suspend-notebook-example.png "suspend notebook")

Once suspended, a resource can be restarted by any user with access to view it in a
similar fashion.

![restart example](../../img/suspend-notebook-restart-example.png "restart example")

## I need a Notebook to remain running ##

Please get in touch with us via e-mail or Slack if you need your resource to continue
running irrespective of access times.

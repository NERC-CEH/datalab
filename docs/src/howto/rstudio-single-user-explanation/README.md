
# Single user restriction of an RStudio notebook #

An RStudio notebook can only be opened by one user at a time.  This means that
multiple users in a project cannot work on the same notebook simultaneously.
The consequence of opening an RStudio notebook that someone else is currently
using is to end their session.

## How will I know if a notebook is in use ##

The link to an RStudio notebook will display a warning if it has been opened recently
(eg within the last 8 hours).  This indicates that it may be in use by another user.
This is important because if you proceed to open the notebook then the current user will
have their instance closed, causing some disruption to them.

## What does this warning look like ##

Here is an example of what this warning looks like.

![rstudio recently opened warning](../../img/rstudio-recently-opened-warning.png "rstudio recently opened warning")

## What should I do? ##

If you are aware of a colleague who may be using the notebook, it would be prudent to
discuss the best way to work together on it.

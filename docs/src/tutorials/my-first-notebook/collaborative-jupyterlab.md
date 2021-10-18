# Working with JupyterLab collaboratively

From JupyterLab version 3.1 onwards, notebooks are run using the
[`--collaborative` flag](https://jupyterlab.readthedocs.io/en/stable/user/rtc.html),
meaning that multiple users can work on the same notebook at the same time,
each seeing live updates as others type and execute cells.

When another user is working on the same notebook, a cursor will appear where
they have selected, and will briefly show a name in a particular colour. This
name is currently set to `Anonymous <Name>` - however, this name is chosen
randomly each time the notebook is launched, so it is possible to have a
different name (and colour) after relaunching the notebook, and it is also
possible for multiple users to have the same name (though they may have
different colours).

An example is shown below - user 1 (on the left) is currently typing, so their
name "Anonymous Chaldene" appears for user 2 (on the right):

![jupyterlab-collaborative-1](../../img/jupyterlab-collaborative-1.png
"jupyterlab collaborative 1")

Then, user 2 (on the right) starts typing, and for user 1 (on the left), they
appear as "Anonymous Arche".

![jupyterlab-collaborative-2](../../img/jupyterlab-collaborative-2.png
"jupyterlab collaborative 2")

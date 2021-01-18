# Using Object Storage within DataLabs

These pages describe how to interact with Object Storage from within Notebook
sessions.

Increasingly object storage is being used to address an issue with the storage,
this is for a number of reasons, a good review on the topic can be found [here](
https://www.netapp.com/us/info/what-is-object-storage.aspx).

Within the DataLab environment, object storage is extremely useful as a place to
store files that are;

* Of a big size (the architecture of object storage allows much easier scaling
  that traditional file storage).
* Unlikely to change. Object Storage is most performant primarily when reading
  files, hence this pattern works best when accessing the same files multiple
  times. This is often true for datasets which once produced/taken do not
  change.

For files that do not meet this criteria, particularly ones that require a lot
of interaction with such as scripts or notebooks, it is recommended to carry on
using the standard file storage provided within the labs which used by default
and available at `/data` within the notebooks.

## Getting Access

Before being able to access the object store, you must have valid user
credentials. These will generally be associated with your JASMIN account and
will be in the form of 2 strings, a secret key and an access key. Both of these
should be kept securely.

Currently the only way to get credentials is to speak to the team, however this
process is expected to be part of the standard JASMIN services portal soon.

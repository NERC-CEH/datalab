# Create a Streamlit site

Streamlit doesn't have built-in support for Jupyter notebooks, so you
need to create a `.py` file to be the entry point for the app.  You'll
have to be logged into DataLabs.  We'll assume you have already saved
your Streamlit app into a file named `app.py` in your storage, and
installed Streamlit into a Conda environment called `my-env`.

In your project, navigate to **Sites**:

![site page](../../img/project-site-page-empty.png "site page")

Choose **Create Site** and fill out the form.  Set `Source Path` to
the directory containing your Streamlit file, such as
`/data/notebooks/jupyterlab-notebook`, and set `Filename` to the name
of the file itself, such as `app.py`.  Also set the Conda environment
path to point to the environment with Streamlit installed, in this
example `/data/conda/my-env`.

Once the environment and storage are set up, the Streamlit app runs in
the same Conda environment as any notebooks using that environment,
and has filesystem access to the whole store.  This means that it can
access any data files and assets that are present in the store.

# 1. Getting Ready

A [Voilà][voila] site can be used to visualise a Jupyter notebook, so,
before continuing, you will need the following:

[voila]: https://github.com/voila-dashboards/voila

* A project
* Project storage
* A JupyterLab notebook
* (Optionally) A Conda environment

For tutorials on the above, see:

* [My First Notebook](../my-first-notebook/)
* [My first Jupyter project](../getting-started-jupyter/)

An example notebook might contain the following in a cell:

```python
import ipywidgets as widgets

slider = widgets.FloatSlider(description='$x$')
text = widgets.FloatText(disabled=True, description='$x^2$')

def compute(*ignore):
    text.value = str(slider.value ** 2)

slider.observe(compute, 'value')

slider.value = 4

widgets.VBox([slider, text])
```

Note that this example requires the `ipywidgets` package to be installed
in the Conda environment if that is being used to run the notebook.

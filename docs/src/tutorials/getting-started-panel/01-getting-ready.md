# 1. Getting Ready

A [Panel][panel] site can be used to visualise a Jupyter notebook, so,
before continuing, you will need the following:

[panel]: https://panel.holoviz.org/getting_started/

* A project
* Project storage
* A JupyterLab notebook
* (Optionally) A Conda environment

For tutorials on the above, see:

* [My First Notebook](../my-first-notebook/)
* [My first Jupyter project](../getting-started-jupyter/)

An example notebook might contain the following:

```python
import matplotlib.pyplot as plt
import panel as pn

pn.extension()
fig = plt.figure()

%matplotlib inline

xs = []
ys = []

int_slider = pn.widgets.IntSlider(name='X value', start=-10, end=10, step=1, value=3)

@pn.depends(int_slider.param.value)
def get_plot(x):
    y = x ** 2

    if x not in xs:
        xs.append(x)
        ys.append(y)

    plt.clf()
    plt.plot(xs, ys, 'ro', markersize=5)
    plt.plot(x, y, 'go', markersize=10)

    return fig

dashboard = pn.Row(
    pn.Column("My Chart", int_slider),
    get_plot # plot function
)

dashboard.servable()
```

This code will produce a simple dashboard with a slider that chooses the x value
for a plot showing the `x^2` function.

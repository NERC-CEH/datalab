# RStudio

In current releases of RStudio there is [native
integration](https://rstudio.github.io/packrat/rstudio.html) between Packrat and
RStudio `projects` which makes the management of dependecies with packrat
easier.

### New Projects

When creating a new project in RStudio, a checkbox can be selected which states
`Use packrat with this project`, this will automatically initialise packrat in
the RStudio session and create the folder structure for packrat by default.

### Existing Projects

If you wish to convert to using Packrat with a current project in RStudio, this
is possible by using the file browser in RStudio to select the directory which
contains the project and navigating to;

```
Settings > Tools > Project Options > Packrat > 'Use packrat with this project'
```

This will automatically install the current packages in the project into a
packrat directory and enable usage of the UI to manage packages via Packrat.

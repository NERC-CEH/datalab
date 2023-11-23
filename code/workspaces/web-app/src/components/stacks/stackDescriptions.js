import { stackTypes } from 'common';
import jupyterlabLogo from '../../assets/images/jupyterlab-logo.png';
import jupyterLogo from '../../assets/images/jupyter-logo.svg';
import nbviewerLogo from '../../assets/images/nbviewer-logo.png';
import rshinyLogo from '../../assets/images/rshiny-logo.png';
import panelLogo from '../../assets/images/panel-logo.png';
import voilaLogo from '../../assets/images/voila-logo.png';
import rstudioLogo from '../../assets/images/rstudio-logo.png';
import zeppelinLogo from '../../assets/images/zeppelin-logo.svg';
import vscodeLogo from '../../assets/images/vscode-logo.svg';
import daskLogo from '../../assets/images/dask-logo.svg';
import sparkLogo from '../../assets/images/apache-spark-logo.svg';

const { JUPYTER, JUPYTERLAB, ZEPPELIN, RSTUDIO, RSHINY, NBVIEWER, PANEL, VOILA, VSCODE, PROJECT, DASK, SPARK } = stackTypes;

const jupyterDescription = 'Web application that allows you to create and share documents that contain live code, equations, visualizations and explanatory text.';
const jupyterlabDescription = 'Web application that allows you to create and share documents that contain live code, equations, visualizations and explanatory text.';
const zeppelinDescription = 'Web-based notebook that enables data-driven, interactive data analytics and collaborative documents with SQL, Scala and more.';
const vscodeDescription = 'Visual Studio Code is a streamlined code editor with support for development operations like debugging, task running, and version control.';
const rstudioDescription = 'RStudio is an integrated development environment (IDE) for R. It includes a console, syntax-highlighting editor that supports '
  + 'direct code execution, as well as tools for plotting, history, debugging and workspace management.';
const rshinyDescription = 'Shiny is an R package that makes it easy to build interactive web apps straight from R. You can host standalone apps on a webpage or '
  + 'embed them in R Markdown documents or build dashboards.';
const nbviewerDescription = 'NBViewer is a simple way to share notebooks. Any Jupyter notebook can be served as a web page.';
const panelDescription = 'Panel is a Python library that lets you create custom interactive web apps and dashboards by connecting user-defined widgets to plots, images, tables, or text.';
const voilaDescription = 'Voila is a library that allows for rendering of live Jupyter notebooks with interactive widgets.';
const projectDescription = 'A project lets users share information';
const daskDescription = 'Dask natively scales Python across multiple workers, providing advanced parallelism for analytics and enabling performance at scale.';
const sparkDescription = 'Spark is an open-source cluster-computing framework for large-scale data processing.';

// NOTE: All other stack details should come from 'src/config/images'
const stackDescriptions = {
  [JUPYTER]: { description: jupyterDescription, logo: jupyterLogo },
  [JUPYTERLAB]: { description: jupyterlabDescription, logo: jupyterlabLogo },
  [ZEPPELIN]: { description: zeppelinDescription, logo: zeppelinLogo },
  [VSCODE]: { description: vscodeDescription, logo: vscodeLogo },
  [RSTUDIO]: { description: rstudioDescription, logo: rstudioLogo },
  [RSHINY]: { description: rshinyDescription, logo: rshinyLogo },
  [NBVIEWER]: { description: nbviewerDescription, logo: nbviewerLogo },
  [PANEL]: { description: panelDescription, logo: panelLogo },
  [VOILA]: { description: voilaDescription, logo: voilaLogo },
  [PROJECT]: { description: projectDescription, initial: true },
  [DASK]: { description: daskDescription, logo: daskLogo },
  [SPARK]: { description: sparkDescription, logo: sparkLogo },
};
export default stackDescriptions;

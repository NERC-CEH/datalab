import { JUPYTER, JUPYTERLAB, ZEPPELIN, RSTUDIO, RSHINY, NBVIEWER, NFS_VOLUME } from '../../../shared/stackTypes';
import jupyterLogo from '../../../assets/images/jupyter-logo.svg';
import jupyterlabLogo from '../../../assets/images/jupyterlab-logo.png';
import zeppelinLogo from '../../../assets/images/zeppelin-logo.svg';
import rstudioLogo from '../../../assets/images/rstudio-logo.png';
import rshinyLogo from '../../../assets/images/rshiny-logo.png';
import nbviewerLogo from '../../../assets/images/nbviewer-logo.png';

const jupyterDescription = 'Web application that allows you to create and share documents that contain live code, equations, visualizations and explanatory text.';
const jupyterlabDescription = 'Web application that allows you to create and share documents that contain live code, equations, visualizations and explanatory text.';
const zeppelinDescription = 'Web-based notebook that enables data-driven, interactive data analytics and collaborative documents with SQL, Scala and more.';
const rstudioDescription = 'RStudio is an integrated development environment (IDE) for R. It includes a console, syntax-highlighting editor that supports ' +
  'direct code execution, as well as tools for plotting, history, debugging and workspace management.';
const rshinyDescription = 'Shiny is an R package that makes it easy to build interactive web apps straight from R. You can host standalone apps on a webpage or ' +
  'embed them in R Markdown documents or build dashboards.';
const nbviewerDescription = 'NBViewer is a simple way to share notebooks. Any Jupyter notebook can be served as a web page.';
const nfsVolumeDescription = 'Network File System (NFS) volume to store data for Notebooks and Sites.';

export default {
  [JUPYTER]: { description: jupyterDescription, logo: jupyterLogo },
  [JUPYTERLAB]: { description: jupyterlabDescription, logo: jupyterlabLogo },
  [ZEPPELIN]: { description: zeppelinDescription, logo: zeppelinLogo },
  [RSTUDIO]: { description: rstudioDescription, logo: rstudioLogo },
  [RSHINY]: { description: rshinyDescription, logo: rshinyLogo },
  [NBVIEWER]: { description: nbviewerDescription, logo: nbviewerLogo },
  [NFS_VOLUME]: { description: nfsVolumeDescription, icon: 'save' },
};

import { JUPYTER, ZEPPELIN } from '../../../shared/notebookTypes';
import jupyerLogo from '../../../assets/images/jupyter-logo.svg';
import zeppelinLogo from '../../../assets/images/zeppelin-logo.svg';

const jupyterDescription = 'Web application that allows you to create and share documents that contain live code, equations, visualizations and explanatory text.';
const zeppelinDescription = 'Web-based notebook that enables data-driven, interactive data analytics and collaborative documents with SQL, Scala and more.';

export default {
  [JUPYTER]: { description: jupyterDescription, logo: jupyerLogo },
  [ZEPPELIN]: { description: zeppelinDescription, logo: zeppelinLogo },
};

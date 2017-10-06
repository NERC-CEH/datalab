import React from 'react';
import DescribeElement from './DescribeElement';

/* eslint-disable max-len */
const datalabDescriptions = [
  { icon: 'people', title: 'Collaborate with Colleagues', supportingText: 'A Data Lab gives you a secure area to collaborate with your colleagues around the world. You can easily create shared drives to store your experimental data and shared notebooks to run your analysis.' },
  { icon: 'storage', title: 'Access Data', supportingText: 'DataLabs make it easy to access and analyse your data, whether it is data you bring into the lab or available for access via protocols like OpenDAP.' },
  { icon: 'desktop_windows', title: 'Simple Access to Parallel Compute', supportingText: 'DataLabs comes with Spark and Dask built in, allowing you to wrap your existing R, Python or Java code in simple statements to parallalise your run, speeding up the computation time and making working with Big Data easy.' },
  { icon: 'public', title: 'Publish Results', supportingText: 'You can quickly set up an RShiny server inside your data lab to expose your results in a friendly, easy to use web page. This lets you publish the data to a wider audience, and allows less technical users to interact with your results through a simple interface that you control.' },
  { icon: 'lock_open', title: 'Open Source', supportingText: 'Our projects are Open Source, allowing community driven development and support of our tools. This increases the speed of development and lowers costs.' },
  { icon: 'play_arrow', title: 'Get Started Quickly', supportingText: 'Sign up now to start creating your Data Lab for your team. Already available: Jupyter Notebooks, Zeppelin Notebooks, RStudio and RShiny with more tools coming soon!' },
];
/* eslint-enable max-len */

const DescribeDatalabs = () => (
  <DescribeElement title="How DataLabs can enhance your research" descriptions={datalabDescriptions} />
);

export default DescribeDatalabs;

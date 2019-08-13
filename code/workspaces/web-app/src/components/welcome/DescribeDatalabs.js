import React from 'react';
import DescribeElement from './DescribeElement';
import slackLogo from '../../assets/images/slack-hori.png';
import gitHubLogo from '../../assets/images/github-hori.png';
import discourseLogo from '../../assets/images/discourse-hori.png';
import navBarLinks from '../../constants/navBarLinks';

/* eslint-disable max-len */
const datalabDescriptions = [
  { icon: 'people', title: 'Collaborate with Colleagues', content: 'A Data Lab gives you a secure area to collaborate with your colleagues around the world. You can easily create shared drives to store your experimental data and shared notebooks to run your analysis.' },
  { icon: 'storage', title: 'Access Data', content: 'DataLabs make it easy to access and analyse your data, whether it is data you bring into the lab or available for access via protocols like OpenDAP.' },
  { icon: 'desktop_windows', title: 'Simple Access to Parallel Compute', content: 'DataLabs comes with Spark and Dask built in, allowing you to wrap your existing R, Python or Java code in simple statements to parallalise your run, speeding up the computation time and making working with Big Data easy.' },
  { icon: 'public', title: 'Publish Results', content: 'You can quickly set up an RShiny server inside your data lab to expose your results in a friendly, easy to use web page. This lets you publish the data to a wider audience, and allows less technical users to interact with your results through a simple interface that you control.' },
  { icon: 'lock_open', title: 'Open Source', content: 'Our projects are Open Source, allowing community driven development and support of our tools. This increases the speed of development and lowers costs.' },
  { icon: 'play_arrow', title: 'Get Started Quickly', content: 'Sign up now to start creating your Data Lab for your team. Already available: Jupyter Notebooks, Zeppelin Notebooks, RStudio and RShiny with more tools coming soon!' },
];
/* eslint-enable max-len */

/* eslint-disable max-len */
const datalabStories = [
  { icon: 'comment', title: 'Pete Henrys', content: 'I wanted to run my R model on the highest resolution UK land cover map, but my local workstation did not have enough memory. By creating a Data Lab, I was able to upload the land cover map and my R model into a Zeppelin notebook. The Data Lab Spark instance was able to run my model on the high resolution map, giving me results that I could not get before.' },
  { icon: 'comment', title: 'Tom August', content: 'After uploading my bio-diversity model into a Jupyter Notebook I was able to run it against the parallel compute facilities in the Data Lab to get results in a couple of hours. This was so much easier than using traditional parallel compute environments, where your model has to be re-written to fit the environment.' },
  { icon: 'comment', title: 'David Ciar', content: 'RShiny is a great way of letting the public access our Change Point analysis. With Data Labs, setting up the web server and getting a URL was easy!' },
];
/* eslint-enable max-len */

/* eslint-disable max-len */
const datalabCommunity = [
  { title: 'Join Us on Slack', content: slackLogo, links: [navBarLinks.SLACK] },
  { title: 'Contribute to Our Projects', content: gitHubLogo, links: [navBarLinks.GITHUB, navBarLinks.DOCKER_HUB] },
  { title: 'Join Our Discourse Forum', content: discourseLogo, links: [navBarLinks.DISCOURSE] },
];
/* eslint-enable max-len */

const DescribeDatalabs = () => (
  <div>
    <DescribeElement title="How DataLabs can enhance your research" descriptions={datalabDescriptions} doubleHeight />
    <DescribeElement title="Success stories" descriptions={datalabStories} invert quote />
    <DescribeElement title="How you can join the DataLabs community" descriptions={datalabCommunity} media />
  </div>
);

export default DescribeDatalabs;

import React from 'react';
import { withStyles } from 'material-ui/styles';
import { blueGrey, deepOrange } from 'material-ui/colors';
import Grid from 'material-ui/Grid';
import Card, { CardHeader, CardContent } from 'material-ui/Card';
import Icon from 'material-ui/Icon';
import Typography from 'material-ui/Typography';
import DescribeElement from './DescribeElement';

/* eslint-disable max-len */
const descriptions = [
  { icon: 'people', title: 'Collaborate with Colleagues', supportingText: 'A Data Lab gives you a secure area to collaborate with your colleagues around the world. You can easily create shared drives to store your experimental data and shared notebooks to run your analysis.' },
  { icon: 'storage', title: 'Access Data', supportingText: 'DataLabs make it easy to access and analyse your data, whether it is data you bring into the lab or available for access via protocols like OpenDAP.' },
  { icon: 'desktop_windows', title: 'Simple Access to Parallel Compute', supportingText: 'DataLabs comes with Spark and Dask built in, allowing you to wrap your existing R, Python or Java code in simple statements to parallalise your run, speeding up the computation time and making working with Big Data easy.' },
  { icon: 'public', title: 'Publish Results', supportingText: 'You can quickly set up an RShiny server inside your data lab to expose your results in a friendly, easy to use web page. This lets you publish the data to a wider audience, and allows less technical users to interact with your results through a simple interface that you control.' },
  { icon: 'lock_open', title: 'Open Source', supportingText: 'Our projects are Open Source, allowing community driven development and support of our tools. This increases the speed of development and lowers costs.' },
  { icon: 'play_arrow', title: 'Get Started Quickly', supportingText: 'Sign up now to start creating your Data Lab for your team. Already available: Jupyter Notebooks, Zeppelin Notebooks, RStudio and RShiny with more tools coming soon!' },
];
/* eslint-enable max-len */

const styles = theme => ({
  container: {
    maxWidth: 1044,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  title: {
    paddingTop: 28,
    paddingBottom: 28,
  },
  card: {
    height: '100%',
    backgroundColor: blueGrey[50],
  },
  cardTitle: {
    marginLeft: 35,
  },
  icon: {
    color: deepOrange[900],
    float: 'left',
    paddingTop: 3,
  },
});

const DescribeDatalabs = ({ classes }) => (
  <div className={classes.container}>
    <Typography className={classes.title} type="display1">How DataLabs can enhance your research</Typography>
    <Grid container align="stretch">
      {descriptions.map((description, idx) => (
        <Grid item xs={12} sm={6} md={4} key={`card-${idx}`}>
          <Card className={classes.card} square>
            <CardContent>
              <Icon className={classes.icon}>{description.icon}</Icon>
              <Typography className={classes.cardTitle} type="headline">{description.title}</Typography>
            </CardContent>
            <CardContent>
              <Typography type="body1">{description.supportingText}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </div>
);

export default withStyles(styles)(DescribeDatalabs);

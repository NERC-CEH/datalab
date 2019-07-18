import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import Segment from '../components/app/Segment';

const NotFoundPage = () => (
  <Segment>
    <Typography gutterBottom type="display1">404 Page Not Found</Typography>
    <p><Link to="/">Go to homepage</Link></p>
  </Segment>
);

export default NotFoundPage;

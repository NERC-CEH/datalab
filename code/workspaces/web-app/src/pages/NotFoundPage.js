import React from 'react';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import Page from './Page';

const NotFoundPage = () => (
  <Page title="404 – Page Not Found">
    <Typography variant="body1"><Link to="/">Go to homepage</Link></Typography>
  </Page>
);

export default NotFoundPage;

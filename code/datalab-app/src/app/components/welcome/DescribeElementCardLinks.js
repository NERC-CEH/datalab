import React from 'react';
import Button from 'material-ui/Button';
import { CardActions } from 'material-ui/Card';

const Link = ({ name, href }) => (
  <Button style={{ fontSize: 'larger' }} color="primary" >
    {`${name} >`}
  </Button>
);

const DescribeElementCardLinks = ({ links }) => (
  <CardActions>
    {links.map(({ name, href }, idx) => (<Link key={`link-${idx}`} name={name} href={href} />))}
  </CardActions>
);

export default DescribeElementCardLinks;

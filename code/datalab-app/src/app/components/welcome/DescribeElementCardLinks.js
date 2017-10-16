import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import { CardActions } from 'material-ui/Card';

const Link = ({ displayName, href }) => (
  <Button style={{ fontSize: 'larger' }} onClick={() => window.open(href)} color="primary">
    {`${displayName} >`}
  </Button>
);

const DescribeElementCardLinks = ({ links }) => (
  <CardActions>
    {links.map(({ displayName, href }, idx) => (<Link key={`link-${idx}`} displayName={displayName} href={href} />))}
  </CardActions>
);

DescribeElementCardLinks.propTypes = {
  links: PropTypes.arrayOf(PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
  })),
};

export default DescribeElementCardLinks;

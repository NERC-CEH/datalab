import React, { useState } from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import PaginationControls from './PaginationControls';
import useCallOnValueChange from '../../hooks/useCallOnValueChange';

const useStyles = makeStyles(theme => ({
  paginationControlBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    padding: [[theme.spacing(2), 0]],
  },
}));

export function calculateNumberOfPages(numberOfItems, itemsPerPage) {
  if (numberOfItems === 0) return 1;

  const numberOfFullPages = Math.floor(numberOfItems / itemsPerPage);
  const numberOfItemsOnPartialPage = numberOfItems % itemsPerPage;
  return numberOfItemsOnPartialPage > 0 ? numberOfFullPages + 1 : numberOfFullPages;
}

function handleNumPagesDroppingBelowPageNum(numPages, pageNum, setPageNum) {
  if (pageNum >= numPages) setPageNum(numPages - 1);
}

const Pagination = ({ items, itemsPerPage = 10, paginationBarItems = null, itemsName = null }) => {
  const classes = useStyles();
  const [pageNum, setPageNum] = useState(0);
  const numPages = calculateNumberOfPages(items.length, itemsPerPage);

  useCallOnValueChange(
    numPages,
    () => handleNumPagesDroppingBelowPageNum(numPages, pageNum, setPageNum),
  );

  const itemsToDisplay = items.slice(itemsPerPage * pageNum, itemsPerPage * (pageNum + 1));

  return (
    <div>
      <div>{itemsToDisplay}</div>
      {(numPages > 1 || paginationBarItems)
        && <div className={classes.paginationControlBar}>
          <PaginationControls pageNum={pageNum} setPageNum={setPageNum} numPages={numPages} itemsName={itemsName} />
          {paginationBarItems
            && <div>{paginationBarItems}</div>
          }
        </div>
      }
    </div>
  );
};

Pagination.propTypes = {
  items: PropTypes.arrayOf(PropTypes.element).isRequired,
  itemsPerPage: PropTypes.number,
  paginationBarItems: PropTypes.node,
};

export default Pagination;

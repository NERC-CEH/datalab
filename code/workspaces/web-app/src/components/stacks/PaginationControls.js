import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import PaginationControlButton, { PREVIOUS_PAGE, NEXT_PAGE } from './PaginationControlButton';
import PaginationControlTextField from './PaginationControlTextField';
import useCallOnValueChange from '../../hooks/useCallOnValueChange';

const useStyles = makeStyles(injectedTheme => ({
  paginationControlsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  controlText: {
    margin: [[0, injectedTheme.spacing(2)]],
    userSelect: 'none',
  },
}));

function pageNumToPageInputValue(pageNum) {
  return pageNum + 1;
}

function pageInputValueToPageNum(pageInputValue) {
  return pageInputValue - 1;
}

function pageInputValueInBounds(pageInputValue, numPages) {
  return pageInputValue >= 1 && pageInputValue <= numPages;
}

function ensurePageInputAlignedWithPageNum(pageInputValue, setPageInputValue, pageNum) {
  const requiredValue = pageNumToPageInputValue(pageNum);
  if (pageInputValue !== requiredValue) setPageInputValue(requiredValue);
}

function handleChangePageToUserInput(
  pageInputValue, setPageInputValue, pageNum, setPageNum, numPages,
) {
  const nanInput = isNaN(pageInputValueToPageNum(pageInputValue));

  if (nanInput || !pageInputValueInBounds(pageInputValue, numPages)) {
    // reset to be the appropriate display for the current page number
    setPageInputValue(pageNumToPageInputValue(pageNum));
  } else {
    setPageNum(pageInputValueToPageNum(pageInputValue));
  }
}

function gotoPreviousPage(pageNum, setPageNum, setPageInputValue) {
  const newPageNum = pageNum - 1;
  setPageNum(newPageNum);
  setPageInputValue(pageNumToPageInputValue(newPageNum));
}

function gotoNextPage(pageNum, setPageNum, setPageInputValue) {
  const newPageNum = pageNum + 1;
  setPageNum(newPageNum);
  setPageInputValue(pageNumToPageInputValue(newPageNum));
}

const PaginationControls = ({ pageNum, setPageNum, numPages, itemsName }) => {
  const classes = useStyles();

  const [pageInputValue, setPageInputValue] = useState(pageNumToPageInputValue(pageNum));

  useCallOnValueChange(
    pageNum,
    () => ensurePageInputAlignedWithPageNum(pageInputValue, setPageInputValue, pageNum),
  );

  const changePageToUserInput = () => handleChangePageToUserInput(
    pageInputValue, setPageInputValue, pageNum, setPageNum, numPages,
  );

  const hasPreviousPage = pageNum > 0;
  const hasNextPage = pageNum < numPages - 1;
  const pageText = itemsName ? `${itemsName} page` : 'Page';

  if (numPages === 1) {
    return (
      <div/>
    );
  }

  return (
    <div className={classes.paginationControlsContainer}>
      <PaginationControlButton
        id="previous-page"
        variant={PREVIOUS_PAGE}
        disabled={!hasPreviousPage}
        onClick={() => gotoPreviousPage(pageNum, setPageNum, setPageInputValue)}
      />
      <div id="page-text" className={classes.controlText}>{pageText}</div>
      <PaginationControlTextField
        pageInputValue={pageInputValue}
        setPageInputValue={setPageInputValue}
        changePageToUserInput={changePageToUserInput}
      />
      <div className={classes.controlText}>of {numPages}</div>
      <PaginationControlButton
        id="next-page"
        variant={NEXT_PAGE}
        disabled={!hasNextPage}
        onClick={() => gotoNextPage(pageNum, setPageNum, setPageInputValue)}
      />
    </div>
  );
};

PaginationControls.propTypes = {
  pageNum: PropTypes.number.isRequired,
  setPageNum: PropTypes.func.isRequired,
  numPages: PropTypes.number.isRequired,
};

export default PaginationControls;

/*eslint-disable */
import React from 'react';
import { Pagination } from 'antd';
import PropTypes from 'prop-types';
import pagination from './Paginations.module.css';

function PaginationSearchPage({ page, pages, getPageNum }) {
  return (
    <div>
      <Pagination
        className={pagination.paginationPages}
        current={page}
        defaultCurrent={page}
        total={pages * 10}
        showSizeChanger={false}
        onChange={(actualPage) => getPageNum(actualPage)}
      />
    </div>
  );
}

PaginationSearchPage.propTypes = {
  paginationNum: PropTypes.func,
  pagesNumber: PropTypes.number,
};

PaginationSearchPage.defaultProps = {
  paginationNum: () => {},
  pagesNumber: null,
};

export default PaginationSearchPage;

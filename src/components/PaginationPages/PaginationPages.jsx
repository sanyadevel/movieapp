/*eslint-disable */
import React from 'react';
import { Pagination } from 'antd';
import PropTypes from 'prop-types';
import pagination from './PaginationPages.module.css';

function PaginationPages({ paginationNum, pagesNumber }) {
  return (
    <div>
      <Pagination
        className={pagination.paginationPages}
        defaultCurrent={1}
        total={pagesNumber * 10}
        showSizeChanger={false}
        onChange={(page) => paginationNum(page)}
      />
    </div>
  );
}

PaginationPages.propTypes = {
  paginationNum: PropTypes.func,
  pagesNumber: PropTypes.number,
};

PaginationPages.defaultProps = {
  paginationNum: () => {},
  pagesNumber: 5,
};

export default PaginationPages;

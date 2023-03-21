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
  page: PropTypes.number,
  pages: PropTypes.number,
  getPageNum: PropTypes.func,
};

PaginationSearchPage.defaultProps = {
  page: null,
  pages: null,
  getPageNum: () => {},
};

export default PaginationSearchPage;

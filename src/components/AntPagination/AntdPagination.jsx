import React from 'react';
import { Pagination } from 'antd';
import PropTypes from 'prop-types';

import pagination from './AntdPagination.module.css';

function AntdPagination({ totalPages, changePage, page }) {
  return (
    <div>
      <Pagination
        className={pagination.paginationPages}
        current={page}
        total={totalPages * 10}
        onChange={(pageNumber) => changePage(pageNumber)}
        showSizeChanger={false}
      />
    </div>
  );
}

AntdPagination.propTypes = {
  page: PropTypes.number,
  changePage: PropTypes.func,
  totalPages: PropTypes.number,
};

AntdPagination.defaultProps = {
  page: null,
  changePage: () => {},
  totalPages: null,
};

export default AntdPagination;

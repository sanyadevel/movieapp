/*eslint-disable*/

import React from 'react';
import { Pagination } from 'antd';
import pagination from './Paginations.module.css';

function PaginationRatedPage({
  ratedMovies,
  totalMoviePages,
  changeRatedMoviePage,
  page,
}) {
  return (
    <div>
      {ratedMovies.length !== 0 && (
        <Pagination
          className={pagination.paginationPages}
          current={page}
          total={totalMoviePages * 10}
          onChange={(page) => changeRatedMoviePage(page)}
          showSizeChanger={false}
        />
      )}
    </div>
  );
}

export default PaginationRatedPage;

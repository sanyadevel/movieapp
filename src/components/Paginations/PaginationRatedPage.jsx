import React from 'react';
import { Pagination } from 'antd';
import PropTypes from 'prop-types';

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
          onChange={(pageNumber) => changeRatedMoviePage(pageNumber)}
          showSizeChanger={false}
        />
      )}
    </div>
  );
}

PaginationRatedPage.propTypes = {
  ratedMovies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      backgroundImage: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
      releaseDate: PropTypes.number,
      voteAverage: PropTypes.number,
      voteCount: PropTypes.number,
      adultCategory: PropTypes.string,
      rating: PropTypes.number,
      rateMovie: PropTypes.func,
      genres: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
    }),
  ),
  page: PropTypes.number,
  changeRatedMoviePage: PropTypes.func,
  totalMoviePages: PropTypes.number,
};

PaginationRatedPage.defaultProps = {
  ratedMovies: [
    {
      id: null,
      backgroundImage: '',
      title: '',
      description: '',
      releaseDate: null,
      voteAverage: null,
      voteCount: null,
      adultCategory: '',
      rating: null,
      rateMovie: () => {},
      genres: [['']],
    },
  ],
  page: null,
  changeRatedMoviePage: () => {},
  totalMoviePages: null,
};

export default PaginationRatedPage;

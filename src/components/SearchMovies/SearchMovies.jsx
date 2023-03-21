import React, { Component } from 'react';
import { Input } from 'antd';
import { debounce } from 'debounce';
import PropTypes from 'prop-types';

import searchMoviesStyles from './SearchMovies.module.css';

class SearchMovies extends Component {
  constructor(props) {
    super(props);
  }

  searchMovies = debounce((e) => {
    const { getInputMovie } = this.props;

    getInputMovie(e.target.value);
  }, 400);

  render() {
    return (
      <div className={searchMoviesStyles['search-movies']}>
        <Input placeholder="Type to search..." onChange={this.searchMovies} />
      </div>
    );
  }
}

SearchMovies.propTypes = {
  getInputMovie: PropTypes.func,
};

SearchMovies.defaultProps = {
  getInputMovie: () => {},
};

export default SearchMovies;

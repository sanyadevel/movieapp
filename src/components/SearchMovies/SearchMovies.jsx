/*eslint-disable*/

import React, { Component } from 'react';
import { Input } from 'antd';
import './SearchMovies.css';
import { debounce } from 'debounce';

class SearchMovies extends Component {
  constructor(props) {
    super(props);
  }

  searchMovies = debounce((e) => {
    this.props.getInputMovie(e.target.value);
  }, 400);

  render() {
    return (
      <div className="search-movies">
        <Input placeholder="Type to search..." onChange={this.searchMovies} />
      </div>
    );
  }
}

export default SearchMovies;

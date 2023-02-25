/* eslint-disable */
import React, { Component } from 'react';

import axios from 'axios';
import Movie from '../Movie';
import './MovieList.module.css';
import PageNotFound from '../PageNotFoundErrorBoundary';
import IsLoading from '../isLoadingComponent';
import PropTypes from 'prop-types';
import movieStyled from './MovieList.module.css';

class MovieList extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    movies: [], // потом изменю название если что
    API_KEY: 'ec987f239ac912179a92ac312d07bcba',
    SEARCH_TERM: 'return',
    PAGE: this.props.PAGE,
    INCLUDE_ADULT_PARAM: false,
    isLoading: false,
    errorBoundery: false,
    pages: null,
    movieIsNotFound: false,
  };

  URL = `https://api.themoviedb.org/3/search/movie?api_key=${this.state.API_KEY}&language=en-US&query=${this.state.SEARCH_TERM}=return&page=${this.state.PAGE}&include_adult=${this.state.INCLUDE_ADULT_PARAM}`;

  getTheMoviesFromApi = async () => {
    try {
      const moviesListApi = await axios
        .get(this.URL)
        .then((movie) => movie.data);

      this.setState(
        {
          movies: [...this.state.movies, ...moviesListApi.results],
          pages: moviesListApi.total_pages,
        },
        () => {
          this.getFilteredMovies();
        },
      );
    } catch (error) {
      this.setState({ errorBoundery: true });
    }
  };

  filteredMovies;

  getFilteredMovies = () => {
    this.filteredMovies = this.state.movies.filter((movie) => {
      return (movie.overview || movie.title).includes(this.props.inputMovie);
    });
    return this.filteredMovies;
  };

  checkAvailabilityOfMovie = () => {
    if (this.filteredMovies.length === 0) {
      this.setState({ movieIsNotFound: true });
    } else {
      this.setState({ movieIsNotFound: false });
    }
  };

  componentDidMount() {
    this.setState({ isLoading: true });

    setTimeout(() => {
      this.setState({ isLoading: false });

      this.getTheMoviesFromApi();
    }, 400);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.PAGE !== this.props.PAGE) {
      this.props.getPaginationPages(this.state.pages);
      this.getFilteredMovies();

      this.setState(
        {
          PAGE: this.props.PAGE,
          movies: [],
        },
        () => {
          this.URL = `https://api.themoviedb.org/3/search/movie?api_key=${this.state.API_KEY}&language=en-US&query=${this.state.SEARCH_TERM}=return&page=${this.state.PAGE}&include_adult=${this.state.INCLUDE_ADULT_PARAM}`;
          this.getTheMoviesFromApi();
        },
      );
    }

    if (prevProps.inputMovie !== this.props.inputMovie) {
      this.checkAvailabilityOfMovie();
    }
  }

  render() {
    return (
      <>
        {this.state.movieIsNotFound && (
          <h3 className={movieStyled.movieIsNotFound}>
            The Movie is Not Found !
          </h3>
        )}
        {this.state.errorBoundery && <PageNotFound />}
        {this.state.isLoading ? (
          <IsLoading />
        ) : (
          <div className={movieStyled.movieList}>
            {this.getFilteredMovies().map((movie) => (
              <Movie
                key={crypto.randomUUID()}
                id={movie.id}
                backgroundImage={movie.backdrop_path}
                title={movie.original_title}
                description={movie.overview}
                releaseDate={movie.release_date}
                voteAverage={movie.vote_average}
                voteCount={movie.vote_count}
                adultCategory={movie.adult}
              />
            ))}
          </div>
        )}
      </>
    );
  }
}

MovieList.propTypes = {
  paginationNum: PropTypes.func,
};

MovieList.defaultProps = {
  paginationNum: () => {},
};

export default MovieList;

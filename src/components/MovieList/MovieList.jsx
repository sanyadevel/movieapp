/* eslint-disable */
import React, { Component } from 'react';

import axios from 'axios';
import Movie from '../Movie';
import './MovieList.module.css';
import PageNotFound from '../PageNotFoundErrorBoundary';
import IsLoading from '../isLoadingComponent';
import PropTypes from 'prop-types';
import movieStyled from './MovieList.module.css';
import PaginationSearchPage from '../Paginations';
import SearchMovies from '../SearchMovies';

class MovieList extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    movies: [],
    SEARCH_TERM: 'return',
    INCLUDE_ADULT_PARAM: false,
    isLoading: false,
    errorBoundery: false,
    pages: null,
    PAGE: 1,
    newMoviesWithGenres: [],
  };

  URL = `https://api.themoviedb.org/3/search/movie?api_key=${this.props.API_KEY}&language=en-US&query=${this.state.SEARCH_TERM}&page=${this.state.PAGE}&include_adult=${this.state.INCLUDE_ADULT_PARAM}`;

  getMoviesFromApi = async () => {
    try {
      const moviesListApi = await axios.get(this.URL);
      const data = await moviesListApi.data;

      this.setState({
        movies: [...data.results].map((movie) => ({
          ...movie,
        })),
        pages: data['total_pages'],
      });
    } catch (error) {
      this.setState({ errorBoundery: true });
    }
  };

  getPageNum = (actualPage) => {
    this.setState({ PAGE: actualPage });
  };

  getInputMovie = (inputMovieDetails) => {
    if (inputMovieDetails !== ''.trim()) {
      this.setState({ SEARCH_TERM: inputMovieDetails }, () => {});
    } else {
      this.setState({ SEARCH_TERM: 'return' }, () => {});
    }
  };

  guestSessionValue = localStorage.getItem('guest_session_id');

  getGuestTokenId = async () => {
    try {
      let tokenId;
      const tokenDataJson = await axios.get(
        `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${this.props.API_KEY}`,
      );
      tokenId = await tokenDataJson.data['guest_session_id'];

      if (!this.guestSessionValue) {
        localStorage.setItem('guest_session_id', tokenId);
      }
    } catch (e) {
      alert(` ${e} Try to refresh the page or try later`);
    }
  };

  async getNewMoviesWithGenres() {
    await this.getMoviesFromApi();

    const newMovieGenres = this.state.movies.map((movie) => {
      const arrGenres = [];
      movie['genre_ids'].forEach((genre) => {
        this.props.movieGenres.forEach((key) => {
          if (genre === key.id) {
            arrGenres.push(key.name);
          }
        });
      });
      return { ...movie, arrGenres };
    });
    await this.setState({ newMoviesWithGenres: newMovieGenres });
  }

  async componentDidMount() {
    this.setState({ isLoading: true });

    if (!this.guestSessionValue) {
      await this.getGuestTokenId();
    }

    setTimeout(async () => {
      await this.getMoviesFromApi();

      this.setState({ isLoading: false }, async () => {
        await this.getNewMoviesWithGenres();
      });
    }, 400);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.PAGE !== this.state.PAGE) {
      this.setState({ isLoading: true }, async () => {
        try {
          this.setState(
            {
              PAGE: this.state.PAGE,
              movies: [],
            },
            async () => {
              this.URL = `https://api.themoviedb.org/3/search/movie?api_key=${this.props.API_KEY}&language=en-US&query=${this.state.SEARCH_TERM}&page=${this.state.PAGE}&include_adult=${this.state.INCLUDE_ADULT_PARAM}`;

              await this.getMoviesFromApi();
              await this.getNewMoviesWithGenres();
            },
          );
        } catch (e) {
          alert(`Try to refresh the page or try later :, ${e}`);
        } finally {
          this.setState({ isLoading: false });
        }
      });
    }

    if (prevState.SEARCH_TERM !== this.state.SEARCH_TERM) {
      if (this.state.SEARCH_TERM.trim() !== '') {
        this.setState({ SEARCH_TERM: this.state.SEARCH_TERM }, async () => {
          this.URL = `https://api.themoviedb.org/3/search/movie?api_key=${this.props.API_KEY}&language=en-US&query=${this.state.SEARCH_TERM}&page=${this.state.PAGE}&include_adult=${this.state.INCLUDE_ADULT_PARAM}`;

          await this.getMoviesFromApi();
          await this.getNewMoviesWithGenres();
        });
      } else {
        this.setState({ movies: [], SEARCH_TERM: 'return' }, async () => {
          this.URL = `https://api.themoviedb.org/3/search/movie?api_key=${this.state.API_KEY}&language=en-US&query=${this.state.SEARCH_TERM}&page=${this.state.PAGE}&include_adult=${this.state.INCLUDE_ADULT_PARAM}`;

          await this.getMoviesFromApi();
          await this.getNewMoviesWithGenres();
        });
        this.setState({ PAGE: this.state.PAGE });
      }
    }
  }

  render() {
    return (
      <>
        <SearchMovies getInputMovie={this.getInputMovie} />
        {this.state.errorBoundery && <PageNotFound />}
        {this.state.isLoading ? (
          <IsLoading />
        ) : (
          <div className={movieStyled.movieList}>
            {this.state.newMoviesWithGenres.map((movie) => (
              <Movie
                key={movie.id}
                id={movie.id}
                backgroundImage={movie['poster_path']}
                title={movie['original_title']}
                description={movie['overview']}
                releaseDate={movie['release_date']}
                voteAverage={movie['vote_average']}
                voteCount={movie['vote_count']}
                adultCategory={movie['adult']}
                rateMovie={this.props.rateMovie}
                genres={movie.arrGenres}
              />
            ))}
          </div>
        )}
        {this.state.movies.length !== 0 && (
          <PaginationSearchPage
            page={this.state.PAGE}
            pages={this.state.pages}
            getPageNum={this.getPageNum}
          />
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

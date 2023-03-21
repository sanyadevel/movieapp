import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import Movie from '../Movie';
import movieStyled from './MovieList.module.css';
import PageIsNotFound from '../PageNotFoundErrorBoundary';
import Loading from '../PageLoading';
import PaginationSearchPage from '../Paginations';
import SearchMovies from '../SearchMovies';

class MovieList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      movies: [],
      SEARCH_TERM: 'return',
      INCLUDE_ADULT_PARAM: false,
      isLoading: false,
      errorBoundary: false,
      pages: null,
      PAGE: 1,
      newMoviesWithGenres: [],
    };

    const { API_KEY } = this.props;
    const { INCLUDE_ADULT_PARAM, SEARCH_TERM, PAGE } = this.state;

    this.URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${SEARCH_TERM}&page=${PAGE}&include_adult=${INCLUDE_ADULT_PARAM}`;
    this.guestSessionValue = localStorage.getItem('guest_session_id');
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
    const { PAGE, SEARCH_TERM, INCLUDE_ADULT_PARAM } = this.state;
    const { API_KEY } = this.props;

    if (prevState.PAGE !== PAGE) {
      try {
        this.setState(
          {
            PAGE,
            movies: [],
          },
          async () => {
            await this.setState({ isLoading: true });

            this.URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${SEARCH_TERM}&page=${PAGE}&include_adult=${INCLUDE_ADULT_PARAM}`;

            await this.getMoviesFromApi();
            await this.getNewMoviesWithGenres();
            await this.setState({ isLoading: false });
          },
        );
      } catch (e) {
        throw new Error(`Try to refresh the page or try later :, ${e}`);
      } finally {
        this.setState({ isLoading: false });
      }
    }

    if (prevState.SEARCH_TERM !== SEARCH_TERM) {
      if (SEARCH_TERM.trim() !== '') {
        this.setState({ SEARCH_TERM }, async () => {
          await this.setState({ isLoading: true });
          this.URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${SEARCH_TERM}&page=${PAGE}&include_adult=${INCLUDE_ADULT_PARAM}`;

          await this.getMoviesFromApi();
          await this.getNewMoviesWithGenres();
          await this.setState({ isLoading: false });
        });
      } else {
        this.setState({ movies: [], SEARCH_TERM: 'return' }, async () => {
          await this.setState({ isLoading: true });

          this.URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${SEARCH_TERM}&page=${PAGE}&include_adult=${INCLUDE_ADULT_PARAM}`;

          await this.getMoviesFromApi();
          await this.getNewMoviesWithGenres();

          await this.setState({ isLoading: false });
        });
        this.setState((prevPage) => ({ PAGE: prevPage.PAGE }));
      }
    }
  }

  getPageNum = (actualPage) => {
    this.setState({ PAGE: actualPage });
  };

  getMoviesFromApi = async () => {
    try {
      const moviesListApi = await axios.get(this.URL);
      const data = await moviesListApi.data;

      this.setState({
        movies: [...data.results].map((movie) => ({
          ...movie,
        })),
        pages: data.total_pages,
      });
    } catch (error) {
      this.setState({ errorBoundary: true });
    }
  };

  getGuestTokenId = async () => {
    const { API_KEY } = this.props;

    try {
      const tokenDataJson = await axios.get(
        `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${API_KEY}`,
      );

      const tokenId = await tokenDataJson.data.guest_session_id;

      if (!this.guestSessionValue) {
        localStorage.setItem('guest_session_id', tokenId);
      }
    } catch (e) {
      throw new Error(` ${e} Try to refresh the page or try later`);
    }
  };

  async getNewMoviesWithGenres() {
    const { movieGenres } = this.props;

    await this.getMoviesFromApi();

    this.setState((prevState) => {
      const newMovieGenres = prevState.movies.map((movie) => {
        const arrGenres = [];

        movie.genre_ids.forEach((genre) => {
          movieGenres.forEach((key) => {
            if (genre === key.id) {
              arrGenres.push(key.name);
            }
          });
        });
        return { ...movie, arrGenres };
      });

      return { newMoviesWithGenres: newMovieGenres };
    });
  }

  getInputMovie = (inputMovieDetails) => {
    if (inputMovieDetails !== ''.trim()) {
      this.setState({ SEARCH_TERM: inputMovieDetails });
    } else {
      this.setState({ SEARCH_TERM: 'return' });
    }
  };

  render() {
    const {
      PAGE,
      pages,
      movies,
      errorBoundary,
      isLoading,
      newMoviesWithGenres,
    } = this.state;
    const { rateMovie } = this.props;

    return (
      <>
        <SearchMovies getInputMovie={this.getInputMovie} />
        {!newMoviesWithGenres.length && !isLoading && (
          <h3 className={movieStyled.movieIsNotFound}>Movie is not found!</h3>
        )}
        {errorBoundary && <PageIsNotFound />}
        {isLoading ? (
          <Loading />
        ) : (
          <div className={movieStyled.movieList}>
            {newMoviesWithGenres.map((movie) => (
              <Movie
                key={movie.id}
                id={movie.id}
                backgroundImage={movie.poster_path}
                title={movie.original_title}
                description={movie.overview}
                releaseDate={movie.release_date}
                voteAverage={movie.vote_average}
                voteCount={movie.vote_count}
                adultCategory={movie.adult}
                rateMovie={rateMovie}
                genres={movie.arrGenres}
              />
            ))}
          </div>
        )}
        {movies.length !== 0 && (
          <PaginationSearchPage
            page={PAGE}
            pages={pages}
            getPageNum={this.getPageNum}
          />
        )}
      </>
    );
  }
}

MovieList.propTypes = {
  rateMovie: PropTypes.func,
  API_KEY: PropTypes.string,
  movieGenres: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.number,
      id: PropTypes.number,
      backgroundImage: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
      releaseDate: PropTypes.number,
      voteAverage: PropTypes.number,
      voteCount: PropTypes.number,
      adultCategory: PropTypes.number,
      rateMovie: PropTypes.func,
      genres: PropTypes.arrayOf(PropTypes.string),
    }),
  ),
};

MovieList.defaultProps = {
  rateMovie: () => {},
  API_KEY: '',
  movieGenres: [
    {
      key: null,
      id: null,
      backgroundImage: '',
      title: '',
      description: '',
      releaseDate: null,
      voteAverage: null,
      voteCount: null,
      adultCategory: null,
      rateMovie: () => {},
      genres: [''],
    },
  ],
};

export default MovieList;

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Movie from '../Movie';
import movieStyled from './MovieList.module.css';
import PageIsNotFound from '../PageIsNotFound';
import Loader from '../Loader';
import AntPagination from '../AntPagination';
import SearchMovies from '../SearchMovies';
import {
  guestSessionValue,
  getGuestTokenId,
  getMoviesFromApi,
} from '../services/services';

class MovieList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      movies: [],
      SEARCH_TERM: 'return',
      INCLUDE_ADULT_PARAM: false,
      isLoading: false,
      hasError: false,
      pages: null,
      page: 1,
      newMoviesWithGenres: [],
    };
  }

  async componentDidMount() {
    try {
      this.setState({ isLoading: true });

      if (!guestSessionValue) {
        await getGuestTokenId();
      }

      this.setState({ isLoading: false }, async () => {
        await this.getNewMoviesWithGenres();
      });
    } catch (e) {
      this.setState({ hasError: true });
    } finally {
      this.setState({ hasError: false });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { page, SEARCH_TERM } = this.state;

    if (prevState.page !== page) {
      try {
        this.setState(
          {
            page,
            movies: [],
          },
          async () => {
            await this.setState({ isLoading: true });

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

          await this.getNewMoviesWithGenres();
          await this.setState({ isLoading: false });
        });
      } else {
        this.setState({ movies: [], SEARCH_TERM: 'return' }, async () => {
          await this.setState({ isLoading: true });

          await this.getNewMoviesWithGenres();

          await this.setState({ isLoading: false });
        });
        this.setState((prevPage) => ({ page: prevPage.page }));
      }
    }
  }

  getPageNum = (actualPage) => {
    this.setState({ page: actualPage });
  };

  getMovies = async () => {
    const { page, SEARCH_TERM, INCLUDE_ADULT_PARAM } = this.state;
    try {
      const movies = await getMoviesFromApi(
        SEARCH_TERM,
        page,
        INCLUDE_ADULT_PARAM,
      );

      this.setState({
        movies: [...movies.results].map((movie) => ({
          ...movie,
        })),
        pages: movies.total_pages,
      });
    } catch (error) {
      this.setState({ hasError: true });
    }
  };

  async getNewMoviesWithGenres() {
    await this.getMovies();
    const { movieGenres } = this.props;

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
    if (inputMovieDetails !== '') {
      this.setState({ SEARCH_TERM: inputMovieDetails });
    } else {
      this.setState({ SEARCH_TERM: 'return' });
    }
  };

  render() {
    const { page, pages, movies, hasError, isLoading, newMoviesWithGenres } =
      this.state;

    return (
      <>
        <SearchMovies getInputMovie={this.getInputMovie} />
        {!isLoading && newMoviesWithGenres.length === 0 && (
          <h3 className={movieStyled.movieIsNotFound}>Movie is not found!</h3>
        )}
        {hasError && <PageIsNotFound />}
        {isLoading ? (
          <Loader />
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
                genres={movie.arrGenres}
              />
            ))}
          </div>
        )}
        {movies.length && (
          <AntPagination
            page={page}
            totalPages={pages}
            changePage={this.getPageNum}
          />
        )}
      </>
    );
  }
}

MovieList.propTypes = {
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

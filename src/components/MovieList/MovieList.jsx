import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Movie from '../Movie';
import movieStyled from './MovieList.module.css';
import PageIsNotFound from '../PageIsNotFound';
import Loader from '../Loader';
import AntPagination from '../AntPagination';
import SearchMovies from '../SearchMovies';
import GenresContext from '../GenresContext';
import { getMoviesFromApi } from '../../services/services';

class MovieList extends Component {
  static contextType = GenresContext;

  constructor(props) {
    super(props);

    this.state = {
      movies: [],
      searchTerm: 'return',
      isIncludedAdultParam: false,
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
    const { page, searchTerm } = this.state;

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

    if (prevState.searchTerm !== searchTerm) {
      if (searchTerm.trim() !== '') {
        this.setState({ searchTerm }, async () => {
          await this.setState({ isLoading: true });

          await this.getNewMoviesWithGenres();
          await this.setState({ isLoading: false });
        });
      } else {
        this.setState({ movies: [], searchTerm: 'return' }, async () => {
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
    const { page, searchTerm, isIncludedAdultParam } = this.state;
    try {
      const movies = await getMoviesFromApi(
        searchTerm,
        page,
        isIncludedAdultParam,
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
    const { context } = this;

    this.setState((prevState) => {
      const newMovieGenres = prevState.movies.map((movie) => {
        const arrGenres = [];

        movie.genre_ids.forEach((genre) => {
          context.forEach((key) => {
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
      this.setState({ searchTerm: inputMovieDetails });
    } else {
      this.setState({ searchTerm: 'return' });
    }
  };

  render() {
    const { page, pages, movies, hasError, isLoading, newMoviesWithGenres } =
      this.state;
    const { tokenId } = this.props;

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
                tokenId={tokenId}
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
  tokenId: PropTypes.number,
};

MovieList.defaultProps = {
  tokenId: null,
};

export default MovieList;

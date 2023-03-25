import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Movie from '../Movie';
import movieStyled from '../MovieList/MovieList.module.css';
import AntdPagination from '../AntPagination/AntdPagination';
import Loader from '../Loader';
import { getRatedMoviesFromApi } from '../../services/services';
import GenresContext from '../GenresContext';

class RatedMovies extends Component {
  static contextType = GenresContext;

  constructor(props) {
    super(props);

    this.state = {
      ratedMovies: [],
      totalPages: 1,
      page: 1,
      isLoading: false,
      newRatedMoviesWithGenres: [],
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });

    setTimeout(async () => {
      await this.getRatedMovies();

      await this.setState(
        { isLoading: false },
        async () => {
          await this.getNewRatedMoviesWithGenres();
        },
        () => {},
      );
    }, 250);
  }

  componentDidUpdate(prevProps, prevState) {
    const { page } = this.state;

    if (prevState.page !== page) {
      try {
        this.setState(
          {
            page,
            ratedMovies: [],
          },
          async () => {
            this.setState({ isLoading: true });

            await this.getRatedMovies();
            await this.getNewRatedMoviesWithGenres();

            this.setState({ isLoading: false });
          },
        );
      } catch (e) {
        throw new Error(`Try to refresh the page or try later :, ${e}`);
      } finally {
        this.setState({ isLoading: false });
      }
    }
  }

  getRatedMovies = async () => {
    const { page } = this.state;
    const { tokenId } = this.props;
    try {
      const moviesData = await getRatedMoviesFromApi(page, tokenId);

      await this.setState({
        ratedMovies: moviesData.results,
        totalPages: moviesData.total_pages,
      });
    } catch (e) {
      throw new Error(`${e}, 'Try to refresh the page or try later `);
    }
  };

  async getNewRatedMoviesWithGenres() {
    await this.getRatedMovies();

    const { context } = this;

    this.setState((prevState) => {
      const newMovieGenres = prevState.ratedMovies.map((movie) => {
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

      return { newRatedMoviesWithGenres: newMovieGenres };
    });
  }

  changeRatedMoviePage = (currentPage) => {
    this.setState({ page: currentPage }, async () => {
      await this.getRatedMovies();
    });
  };

  render() {
    const {
      isLoading,
      newRatedMoviesWithGenres,
      totalPages,
      ratedMovies,
      page,
    } = this.state;
    const { tokenId } = this.props;

    return (
      <>
        {!isLoading && newRatedMoviesWithGenres.length === 0 && (
          <h3 className={movieStyled.movieIsNotFound}>
            No Rated Movies Found !
          </h3>
        )}
        {isLoading ? (
          <Loader />
        ) : (
          <div className={movieStyled.movieList}>
            {newRatedMoviesWithGenres.map((movie) => (
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
                rating={movie.rating}
                genres={movie.arrGenres}
                tokenId={tokenId}
              />
            ))}
          </div>
        )}
        {newRatedMoviesWithGenres.length && (
          <AntdPagination
            totalPages={totalPages}
            ratedMovies={ratedMovies}
            page={page}
            changePage={this.changeRatedMoviePage}
          />
        )}
      </>
    );
  }
}

RatedMovies.propTypes = {
  tokenId: PropTypes.number,
};

RatedMovies.defaultProps = {
  tokenId: null,
};

export default RatedMovies;

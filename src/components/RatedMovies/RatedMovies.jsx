import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Movie from '../Movie';
import movieStyled from '../MovieList/MovieList.module.css';
import AntdPagination from '../AntPagination/AntdPagination';
import Loader from '../Loader';
import { getRatedMoviesFromApi } from '../services/services';

class RatedMovies extends Component {
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

      await this.setState({ isLoading: false }, async () => {
        await this.getNewRatedMoviesWithGenres();
      });
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
    try {
      const moviesData = await getRatedMoviesFromApi(page);

      await this.setState(
        {
          ratedMovies: moviesData.results,
          totalPages: moviesData.total_pages,
        },
        () => {
          console.log(moviesData.results, 'moviesData.results');
          console.log(moviesData.total_pages, 'moviesData.total_pages');
        },
      );
    } catch (e) {
      throw new Error(`${e}, 'Try to refresh the page or try later `);
    }
  };

  async getNewRatedMoviesWithGenres() {
    await this.getRatedMovies();

    const { movieGenres } = this.props;

    this.setState((prevState) => {
      const newMovieGenres = prevState.ratedMovies.map((movie) => {
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

      return { newRatedMoviesWithGenres: newMovieGenres };
    });
  }

  changeRatedMoviePage = (currentPage) => {
    this.setState({ page: currentPage }, async () => {
      await this.getRatedMovies();
    });
  };

  render() {
    console.log('rendered');
    const {
      isLoading,
      newRatedMoviesWithGenres,
      totalPages,
      ratedMovies,
      page,
    } = this.state;

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
      adultCategory: PropTypes.string,
      rating: PropTypes.number,
      rateMovie: PropTypes.func,
      genres: PropTypes.arrayOf(PropTypes.string),
    }),
  ),
};

RatedMovies.defaultProps = {
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
      adultCategory: '',
      rating: null,
      genres: ['', ''],
    },
  ],
};

export default RatedMovies;

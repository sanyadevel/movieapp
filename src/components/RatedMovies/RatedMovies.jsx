import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import Movie from '../Movie';
import movieStyled from '../MovieList/MovieList.module.css';
import PaginationRatedPage from '../Paginations/PaginationRatedPage';
import IsLoading from '../isLoadingComponent';

class RatedMovies extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ratedMovies: [],
      totalMoviePages: 1,
      PAGE: 1,
      isLoading: false,
      newRatedMoviesWithGenres: [],
    };

    const { API_KEY } = this.props;
    const { PAGE } = this.state;

    this.guestSessionValue = localStorage.getItem('guest_session_id');
    this.ratedMoviesAdress = `https://api.themoviedb.org/3/guest_session/${this.guestSessionValue}/rated/movies?api_key=${API_KEY}&language=en-US&sort_by=created_at.asc&page=${PAGE}`;
  }

  componentDidMount() {
    this.setState({ isLoading: true });

    setTimeout(async () => {
      await this.getRatedMoviesFromApi();

      this.setState({ isLoading: false });

      await this.getNewRatedMoviesWithGenres();
    }, 250);
  }

  componentDidUpdate(prevProps, prevState) {
    const { PAGE } = this.state;
    const { API_KEY } = this.props;

    if (prevState.PAGE !== PAGE) {
      try {
        this.setState(
          {
            PAGE,
            ratedMovies: [],
          },
          async () => {
            this.setState({ isLoading: true });

            this.ratedMoviesAdress = `https://api.themoviedb.org/3/guest_session/${this.guestSessionValue}/rated/movies?api_key=${API_KEY}&language=en-US&sort_by=created_at.asc&page=${PAGE}`;

            await this.getRatedMoviesFromApi();
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

  getRatedMoviesFromApi = async () => {
    try {
      if (this.guestSessionValue) {
        const jsonRatedMovies = await axios.get(this.ratedMoviesAdress);
        const ratedMovies = await jsonRatedMovies.data.results;
        const totalMoviePages = await jsonRatedMovies.data.total_pages;

        this.setState({ ratedMovies, totalMoviePages });
      }
    } catch (e) {
      throw new Error(`${e}, 'Try to refresh the page or try later `);
    }
  };

  async getNewRatedMoviesWithGenres() {
    const { movieGenres } = this.props;

    await this.getRatedMoviesFromApi();

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
    this.setState({ PAGE: currentPage }, async () => {
      const { API_KEY } = this.props;
      const { PAGE } = this.state;

      this.ratedMoviesAdress = `https://api.themoviedb.org/3/guest_session/${this.guestSessionValue}/rated/movies?api_key=${API_KEY}&language=en-US&sort_by=created_at.asc&page=${PAGE}`;

      await this.getRatedMoviesFromApi();
    });
  };

  render() {
    const {
      isLoading,
      newRatedMoviesWithGenres,
      totalMoviePages,
      ratedMovies,
      PAGE,
    } = this.state;
    const { rateMovie } = this.props;

    return (
      <>
        {!isLoading && newRatedMoviesWithGenres.length === 0 && (
          <h3 className={movieStyled.movieIsNotFound}>
            No Rated Movies Found !
          </h3>
        )}
        {isLoading ? (
          <IsLoading />
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
                rateMovie={rateMovie}
                genres={movie.arrGenres}
              />
            ))}
          </div>
        )}
        <PaginationRatedPage
          totalMoviePages={totalMoviePages}
          ratedMovies={ratedMovies}
          page={PAGE}
          changeRatedMoviePage={this.changeRatedMoviePage}
        />
      </>
    );
  }
}

RatedMovies.propTypes = {
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
      adultCategory: PropTypes.string,
      rating: PropTypes.number,
      rateMovie: PropTypes.func,
      genres: PropTypes.arrayOf(PropTypes.string),
    }),
  ),
};

RatedMovies.defaultProps = {
  rateMovie: () => {},
  API_KEY: null,
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

/*eslint-disable*/

import React, { Component } from 'react';
import Movie from '../Movie';
import movieStyled from '../MovieList/MovieList.module.css';
import PaginationRatedPage from '../Paginations/PaginationRatedPage';
import axios from 'axios';
import IsLoading from '../isLoadingComponent';

class RatedMovies extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    ratedMovies: [],
    totalMoviePages: 1,
    PAGE: 1,
    isLoading: false,
    newRatedMoviesWithGenres: [],
  };

  guestSessionValue = localStorage.getItem('guest_session_id');
  ratedMoviesAdress = `https://api.themoviedb.org/3/guest_session/${this.guestSessionValue}/rated/movies?api_key=${this.props.API_KEY}&language=en-US&sort_by=created_at.asc&page=${this.state.PAGE}`;

  getRatedMoviesFromApi = async () => {
    try {
      if (this.guestSessionValue) {
        const jsonRatedMovies = await axios.get(this.ratedMoviesAdress);
        const ratedMovies = await jsonRatedMovies.data.results;
        const totalMoviePages = await jsonRatedMovies.data['total_pages'];

        this.setState({ ratedMovies, totalMoviePages });
      }
    } catch (e) {
      alert(`${e}, 'Try to refresh the page or try later `);
    }
  };

  async getNewRatedMoviesWithGenres() {
    await this.getRatedMoviesFromApi();

    const newMovieGenres = this.state.ratedMovies.map((movie) => {
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
    await this.setState({ newRatedMoviesWithGenres: newMovieGenres });
  }

  changeRatedMoviePage = (currentPage) => {
    this.setState({ PAGE: currentPage }, async () => {
      this.ratedMoviesAdress = `https://api.themoviedb.org/3/guest_session/${this.guestSessionValue}/rated/movies?api_key=${this.props.API_KEY}&language=en-US&sort_by=created_at.asc&page=${this.state.PAGE}`;
      await this.getRatedMoviesFromApi();
    });
  };

  componentDidMount() {
    this.setState({ isLoading: true });
    setTimeout(async () => {
      await this.getRatedMoviesFromApi();
      this.setState({ isLoading: false });
      await this.getNewRatedMoviesWithGenres();
    }, 250);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.PAGE !== this.state.PAGE) {
      this.setState({ isLoading: true }, async () => {
        try {
          this.setState(
            {
              PAGE: this.state.PAGE,
              ratedMovies: [],
            },
            async () => {
              this.ratedMoviesAdress = `https://api.themoviedb.org/3/guest_session/${this.guestSessionValue}/rated/movies?api_key=${this.props.API_KEY}&language=en-US&sort_by=created_at.asc&page=${this.state.PAGE}`;

              await this.getRatedMoviesFromApi();
              await this.getNewRatedMoviesWithGenres();
            },
          );
        } catch (e) {
          alert(`Try to refresh the page or try later :, ${e}`);
        } finally {
          this.setState({ isLoading: false });
        }
      });
    }
  }

  render() {
    return (
      <>
        {!this.state.isLoading &&
          this.state.newRatedMoviesWithGenres.length === 0 && (
            <h3 className={movieStyled.movieIsNotFound}>
              No Rated Movies Found !
            </h3>
          )}
        {this.state.isLoading ? (
          <IsLoading />
        ) : (
          <div className={movieStyled.movieList}>
            {this.state.newRatedMoviesWithGenres.map((movie) => (
              <Movie
                key={movie.id}
                id={movie.id}
                backgroundImage={movie['poster_path']}
                title={movie['original_title']}
                description={movie.overview}
                releaseDate={movie.release_date}
                voteAverage={movie.vote_average}
                voteCount={movie.vote_count}
                adultCategory={movie.adult}
                rating={movie.rating}
                rateMovie={this.props.rateMovie}
                genres={movie.arrGenres}
              />
            ))}
          </div>
        )}
        <PaginationRatedPage
          totalMoviePages={this.state.totalMoviePages}
          ratedMovies={this.state.ratedMovies}
          page={this.state.PAGE}
          changeRatedMoviePage={this.changeRatedMoviePage}
        />
      </>
    );
  }
}

export default RatedMovies;

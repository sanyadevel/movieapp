import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Offline, Online } from 'react-detect-offline';
import axios from 'axios';

import './App.css';
import logoStyles from './components/NoInternetConnection/NoInternetConnection.module.css';
import SelectSearchRatedButtons from './components/SelectSearchRatedButtons';
import MovieList from './components/MovieList';
import NoInternetConnection from './components/NoInternetConnection';
import RatedMovies from './components/RatedMovies';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      API_KEY: 'ec987f239ac912179a92ac312d07bcba',
      movieGenres: [],
    };
  }

  async componentDidMount() {
    await this.getGenresFromApi();
  }

  getGenresFromApi = async () => {
    const { API_KEY } = this.state;

    const genresListFromApi = await axios.get(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`,
    );
    const genresData = await genresListFromApi.data;

    this.setState({ movieGenres: genresData });
  };

  rateMovie = async (id, rating) => {
    try {
      const guestSessionValue = localStorage.getItem('guest_session_id');
      const { API_KEY } = this.state;

      if (guestSessionValue) {
        const jsonRatedMovies = await axios.post(
          `https://api.themoviedb.org/3/movie/${id}/rating?api_key=${API_KEY}&guest_session_id=${guestSessionValue}`,
          {
            value: rating,
          },
        );
      }
    } catch (e) {
      throw new Error(` ${e} Try to refresh the page or try later`);
    }
  };

  render() {
    const { API_KEY, movieGenres } = this.state;

    return (
      <>
        <Offline className={logoStyles.logo}>
          <NoInternetConnection />
        </Offline>

        <div className="movie-app">
          <Online>
            <div className="container">
              <Router>
                <SelectSearchRatedButtons />
                <Routes>
                  <Route
                    path="/"
                    element={
                      <MovieList
                        API_KEY={API_KEY}
                        guestSessionValue={this.guestSessionValue}
                        rateMovie={this.rateMovie}
                        movieGenres={movieGenres.genres}
                      />
                    }
                  />
                  <Route
                    path="/rated"
                    element={
                      <RatedMovies
                        guestSessionValue={this.guestSessionValue}
                        API_KEY={API_KEY}
                        rateMovie={this.rateMovie}
                        movieGenres={movieGenres.genres}
                      />
                    }
                  />
                </Routes>
              </Router>
            </div>
          </Online>
        </div>
      </>
    );
  }
}

export default App;

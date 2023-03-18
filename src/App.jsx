/* eslint-disable */
import React, { Component } from 'react';

import './App.css';
import logoStyles from './components/NoInternetConnection/NoInternetConnection.module.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Offline, Online } from 'react-detect-offline';
import SelectSearchRatedButtons from './components/SelectSearchRatedButtons';
import MovieList from './components/MovieList';
import NoInternetConnection from './components/NoInternetConnection';
import RatedMovies from './components/RatedMovies';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    API_KEY: 'ec987f239ac912179a92ac312d07bcba',
    movieGenres: [],
  };

  getGenresFromApi = async () => {
    const genresListFromApi = await axios.get(
      'https://api.themoviedb.org/3/genre/movie/list?api_key=ec987f239ac912179a92ac312d07bcba',
    );
    const genresData = await genresListFromApi.data;

    this.setState({ movieGenres: genresData });
  };

  rateMovie = async (id, rating) => {
    try {
      const guestSessionValue = localStorage.getItem('guest_session_id');

      if (guestSessionValue) {
        const jsonRatedMovies = await axios.post(
          `https://api.themoviedb.org/3/movie/${id}/rating?api_key=${this.state.API_KEY}&guest_session_id=${guestSessionValue}`,
          {
            value: rating,
          },
        );
      }
    } catch (e) {
      alert(` ${e} Try to refresh the page or try later`);
    }
  };

  async componentDidMount() {
    await this.getGenresFromApi();
  }

  render() {
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
                        API_KEY={this.state.API_KEY}
                        guestSessionValue={this.guestSessionValue}
                        rateMovie={this.rateMovie}
                        movieGenres={this.state.movieGenres['genres']}
                      />
                    }
                  />
                  <Route
                    path="/rated"
                    element={
                      <RatedMovies
                        guestSessionValue={this.guestSessionValue}
                        API_KEY={this.state.API_KEY}
                        rateMovie={this.rateMovie}
                        movieGenres={this.state.movieGenres['genres']}
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

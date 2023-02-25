/* eslint-disable */
import React, { Component } from 'react';

import './App.css';
import logoStyles from './components/NoInternetConnection/NoInternetConnection.module.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Offline, Online } from 'react-detect-offline';
import SearchMovies from './components/SearchMovies';
import SelectSearchRatedButtons from './components/SelectSearchRatedButtons';
import MovieList from './components/MovieList';
import PaginationPages from './components/PaginationPages';
import NoInternetConnection from './components/NoInternetConnection';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      PAGE: 1,
      pagesNumber: 5,
      inputMovie: '',
    };
  }

  paginationNum = (pageNumber) => {
    this.setState({ PAGE: pageNumber });
  };

  getPaginationPages = (pages) => {
    this.setState({ pagesNumber: pages });
  };

  getInputMovie = (inputMovie) => {
    return this.setState({ inputMovie });
  };

  render() {
    const { pagesNumber, PAGE } = this.state;

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
                <SearchMovies
                  getInputMovie={this.getInputMovie}
                  inputMovie={this.state.inputMovie}
                />
                <Routes>
                  <Route
                    path="/"
                    element={
                      <MovieList
                        PAGE={PAGE}
                        getPaginationPages={this.getPaginationPages}
                        inputMovie={this.state.inputMovie}
                      />
                    }
                  />
                </Routes>
                <PaginationPages
                  paginationNum={this.paginationNum}
                  pagesNumber={pagesNumber}
                />
              </Router>
            </div>
          </Online>
        </div>
      </>
    );
  }
}

export default App;

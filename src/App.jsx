import React, { Component } from 'react';
import { Offline, Online } from 'react-detect-offline';
import { Tabs } from 'antd';

import './App.css';
import logoStyles from './components/NoInternetConnection/NoInternetConnection.module.css';
import MovieList from './components/MovieList';
import NoInternetConnection from './components/NoInternetConnection';
import { getGenresFromApi } from './services/services';
import RatedMovies from './components/RatedMovies';
import GenresContext from './components/GenresContext';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      movieGenres: [],
    };
  }

  async componentDidMount() {
    const genresData = await getGenresFromApi();

    await this.setState({ movieGenres: genresData.genres });
  }

  render() {
    const { movieGenres } = this.state;
    const items = [
      {
        key: 'Tab1',
        label: 'Search',
        children: <MovieList />,
      },
      {
        key: 'Tab2',
        label: 'Rated',
        children: <RatedMovies />,
      },
    ];

    return (
      <>
        <Offline className={logoStyles.logo}>
          <NoInternetConnection />
        </Offline>

        <div className="movie-app">
          <Online>
            <div className="container">
              <GenresContext.Provider value={movieGenres}>
                <Tabs
                  centered="true"
                  tabBarStyle={{
                    width: '13%',
                    margin: '22px auto',
                  }}
                  size="large"
                  defaultActiveKey="1"
                  items={items}
                  destroyInactiveTabPane
                />
              </GenresContext.Provider>
            </div>
          </Online>
        </div>
      </>
    );
  }
}

export default App;

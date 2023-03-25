import React, { Component } from 'react';
import { Offline, Online } from 'react-detect-offline';
import { Tabs } from 'antd';

import './App.css';
import logoStyles from './components/NoInternetConnection/NoInternetConnection.module.css';
import MovieList from './components/MovieList';
import NoInternetConnection from './components/NoInternetConnection';
import RatedMovies from './components/RatedMovies';
import { getGenresFromApi } from './components/services/services';

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

    return (
      <>
        <Offline className={logoStyles.logo}>
          <NoInternetConnection />
        </Offline>

        <div className="movie-app">
          <Online>
            <div className="container">
              <Tabs
                centered="true"
                tabBarStyle={{
                  width: '13%',
                  margin: '22px auto',
                }}
                size="large"
                defaultActiveKey="1"
                items={[
                  {
                    key: '1',
                    label: 'Search',
                    children: <MovieList movieGenres={movieGenres} />,
                  },
                  {
                    key: '2',
                    label: 'Rated',
                    children: <RatedMovies movieGenres={movieGenres} />,
                  },
                ]}
              />
            </div>
          </Online>
        </div>
      </>
    );
  }
}

export default App;

import React, { Component } from 'react';
import { Offline, Online } from 'react-detect-offline';
import { Tabs } from 'antd';

import './App.css';
import logoStyles from './components/NoInternetConnection/NoInternetConnection.module.css';
import MovieList from './components/MovieList';
import NoInternetConnection from './components/NoInternetConnection';
import { getGenresFromApi, getGuestTokenId } from './services/services';
import RatedMovies from './components/RatedMovies';
import GenresContext from './components/GenresContext';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      movieGenres: [],
      tokenId: null,
    };
  }

  async componentDidMount() {
    let tokenId = localStorage.getItem('guest_Session_Id');

    if (!tokenId) {
      tokenId = await getGuestTokenId();

      localStorage.setItem('guest_Session_Id', tokenId);
    }
    this.setState({ tokenId });

    const genresData = await getGenresFromApi();

    await this.setState({ movieGenres: genresData.genres });
  }

  render() {
    const { movieGenres, tokenId } = this.state;
    const items = [
      {
        key: 'Tab1',
        label: 'Search',
        children: <MovieList tokenId={tokenId} />,
      },
      {
        key: 'Tab2',
        label: 'Rated',
        children: <RatedMovies tokenId={tokenId} />,
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

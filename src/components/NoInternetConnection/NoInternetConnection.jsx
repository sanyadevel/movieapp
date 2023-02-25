import React from 'react';

import noInternet from './NoInternetConnection.module.css';
import noConnectionImg from '../../assets/images/noConnectionImg.png';

function NoInternetConnection() {
  return (
    <div className={noInternet.noInternetContainer}>
      <img
        className={noInternet.logo}
        src={noConnectionImg}
        alt="No connection"
      />
      <h1 className={noInternet.noInternetTitle}>
        Нет подключения к Интернету
      </h1>
      <h3 className={noInternet.noInternetDescription}>
        Проверьте подключение к Интернету и попробуйте заного.
      </h3>
    </div>
  );
}

export default NoInternetConnection;

import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

import searchButton from './SelectSearchRatedButtons.module.css';

function SelectSearchRatedButtons() {
  return (
    <div className={searchButton.searchButtons}>
      <Link to="/">
        <Button className={searchButton.rightSearchButton}>Search</Button>
      </Link>
      <Link to="/rated">
        <Button>Rated</Button>
      </Link>
    </div>
  );
}

export default SelectSearchRatedButtons;

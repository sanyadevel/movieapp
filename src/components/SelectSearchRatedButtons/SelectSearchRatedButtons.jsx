import React from 'react';
import { Button } from 'antd';
import searchButton from './SelectSearchRatedButtons.module.css';

function SelectSearchRatedButtons() {
  return (
    <div className={searchButton.searchButtons}>
      <Button className={searchButton.rightSearchButton}>Search</Button>
      <Button>Rated</Button>
    </div>
  );
}

export default SelectSearchRatedButtons;

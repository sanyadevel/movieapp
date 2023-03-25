import React from 'react';
import { Space, Spin } from 'antd';

import loadingStyles from './Loader.module.css';

function Loader() {
  return (
    <Space direction="vertical" className={loadingStyles.antdSpaceUi}>
      <Spin tip="Loading content..." size="large" />
    </Space>
  );
}

export default Loader;

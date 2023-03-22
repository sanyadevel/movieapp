import React from 'react';
import { Space, Spin } from 'antd';

import loadingStyles from './PageLoading.module.css';

function PageLoading() {
  return (
    <Space direction="vertical" className={loadingStyles.antdSpaceUi}>
      <Spin tip="Loading content..." size="large" />
    </Space>
  );
}

export default PageLoading;

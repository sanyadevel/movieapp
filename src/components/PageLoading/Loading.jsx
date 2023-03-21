import React from 'react';
import { Space, Spin } from 'antd';

import isLoadingStyles from './PageLoading.css';

function Loading() {
  return (
    <Space direction="vertical" className={isLoadingStyles.antdSpaceUi}>
      <Spin tip="Loading content..." size="large" />
    </Space>
  );
}

export default Loading;

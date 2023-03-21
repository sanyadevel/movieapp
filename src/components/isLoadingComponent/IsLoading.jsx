import React from 'react';
import { Space, Spin } from 'antd';

import isLoadingStyles from './IsLoading.module.css';

function IsLoading() {
  return (
    <Space direction="vertical" className={isLoadingStyles.antdSpaceUi}>
      <Spin tip="Loading content..." size="large" />
    </Space>
  );
}

export default IsLoading;

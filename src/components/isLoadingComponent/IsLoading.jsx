import React from 'react';
import { Space, Spin } from 'antd';

function IsLoading() {
  return (
    <Space
      direction="vertical"
      style={{
        width: '100%',
        alignItems: 'center',
        marginTop: 70,
      }}
    >
      <Spin tip="Loading content..." size="large" />
    </Space>
  );
}

export default IsLoading;

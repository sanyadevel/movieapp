import React from 'react';
import { Alert, Space } from 'antd';

function PageNotFound() {
  return (
    <Space
      direction="vertical"
      style={{
        width: '100%',
        marginTop: 30,
      }}
    >
      <Alert
        message="Page not Found"
        type="error"
        style={{ height: 80, textAlign: 'center', fontSize: 30 }}
      />
    </Space>
  );
}

export default PageNotFound;

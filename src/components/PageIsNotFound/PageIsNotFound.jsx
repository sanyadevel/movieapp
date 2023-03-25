import React from 'react';
import { Alert, Space } from 'antd';

import PageIsNotFoundStyles from './PageIsNotFound.module.css';

function PageIsNotFound() {
  return (
    <Space direction="vertical" className={PageIsNotFoundStyles.antdSpaceUi}>
      <Alert
        message="Page not Found"
        type="error"
        className={PageIsNotFoundStyles.antdAlertUi}
      />
    </Space>
  );
}

export default PageIsNotFound;

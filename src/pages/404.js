import React from 'react';
import Link from 'umi/link';
import Exception from '@/common/Exception';

export default () => (
  <Exception backText="返回首页"
      linkElement={Link}
      redirect="/chassisSystem/102"
      style={{ minHeight: 500, height: '100%' }}
      type="404"
  />
);

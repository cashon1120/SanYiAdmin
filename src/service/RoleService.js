// 角色管理
import request from '@/utils/request';

export async function add(params) {
  return request('roleResources/saveRoleResources', {
    method: 'POST',
    body: params
  });
}

export async function fetch(params) {
  return request('roleResources/roleResourceList', {
    method: 'POST',
    body: params
  });
}

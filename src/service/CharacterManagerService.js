// 角色管理
import request from '@/utils/request';

export async function add(params) {
  return request('role/saveRole', {
    method: 'POST',
    body: params
  });
}

export async function fetch(params) {
  return request('role/roleList', {
    method: 'POST',
    body: params
  });
}

export async function update(params) {
  return request('role/editRole', {
    method: 'POST',
    body: params
  });
}

export async function del(params) {
  return request('role/delRole', {
    method: 'POST',
    body: params
  });
}
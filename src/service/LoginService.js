import request from '@/utils/request';

export async function login(params) {
  return request('login', {
    method: 'POST',
    body: params
  });
}

export async function queryCurrent(params) {
  return request('sysUser/userInfo', {
    method: 'POST',
    body: params
  });
}

export async function editPassword(params) {
  return request('sysUser/editPassword', {
    method: 'POST',
    body: params
  });
}
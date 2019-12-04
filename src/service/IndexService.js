import request from '@/utils/request';

export async function count(params) {
  return request('login', {
    method: 'POST',
    body: params
  });
}

export async function list(params) {
  return request('sysUser/userInfo', {
    method: 'POST',
    body: params
  });
}

export async function routers(params) {
  return request('sysUser/userInfo', {
    method: 'POST',
    body: params
  });
}
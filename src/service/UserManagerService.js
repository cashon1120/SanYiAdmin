// 角色管理
import request from '@/utils/request';

export async function add(params) {
  return request('userManager/saveSysUser', {
    method: 'POST',
    body: params
  });
}

export async function fetch(params) {
  return request('userManager/sysUserList', {
    method: 'POST',
    body: params
  });
}

export async function update(params) {
  return request('userManager/editUserInfo', {
    method: 'POST',
    body: params
  });
}

export async function disableUser(params) {
  return request('userManager/disableActivation', {
    method: 'POST',
    body: params
  });
}

export async function resetPassword(params) {
  return request('userManager/resetPassword', {
    method: 'POST',
    body: params
  });
}

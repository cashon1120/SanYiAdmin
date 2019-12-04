// 部门管理
import request from '@/utils/request';

export async function add(params) {
  return request('department/saveDepartment', {
    method: 'POST',
    body: params
  });
}

export async function fetch(params) {
  return request('department/departmentList', {
    method: 'POST',
    body: params
  });
}

export async function update(params) {
  return request('department/editDepartment', {
    method: 'POST',
    body: params
  });
}

export async function del(params) {
  return request('department/delDepartment', {
    method: 'POST',
    body: params
  });
}
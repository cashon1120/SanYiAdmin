import request from '@/utils/request';

export async function fetch(params) {
  return request('sysResource/resourceList', {
    method: 'POST',
    body: params
  });
}

export async function add(params) {
  return request('sysResource/saveResources', {
    method: 'POST',
    body: params
  });
}

export async function update(params) {
  return request('sysResource/editResource', {
    method: 'POST',
    body: params
  });
}

export async function del(params) {
  return request('sysResource/delResource', {
    method: 'POST',
    body: params
  });
}



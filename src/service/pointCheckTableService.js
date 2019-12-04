import request from '@/utils/request';

export async function add(params) {
  return request('check/saveCheckInfo', {
    method: 'POST',
    body: params
  });
}

export async function fetch(params) {
  return request('check/checkInfoList', {
    method: 'POST',
    body: params
  });
}

export async function update(params) {
  return request('check/editCheckInfo', {
    method: 'POST',
    body: params
  });
}

export async function del(params) {
  return request('check/delCheckInfo', {
    method: 'POST',
    body: params
  });
}

export async function review(params) {
  return request('check/reviewCheckInfo', {
    method: 'POST',
    body: params
  });
}

export async function info(params) {
  return request('check/checkInfo', {
    method: 'POST',
    body: params
  });
}
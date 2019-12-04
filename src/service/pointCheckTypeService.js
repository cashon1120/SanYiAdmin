import request from '@/utils/request';

export async function add(params) {
  return request('checkSystem/checkSystem', {
    method: 'POST',
    body: params
  });
}

export async function fetch(params) {
  return request('checkItem/list', {
    method: 'POST',
    body: params
  });
}

export async function update(params) {
  return request('checkSystem/editCheckSystem', {
    method: 'POST',
    body: params
  });
}

export async function setStatus(params) {
  return request('checkSystem/adjustmentCheckSystemStatus', {
    method: 'POST',
    body: params
  });
}
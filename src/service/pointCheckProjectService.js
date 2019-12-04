import request from '@/utils/request';

export async function add(params) {
  return request('checkProject/saveCheckProject', {
    method: 'POST',
    body: params
  });
}

export async function fetch(params) {
  return request('checkProject/checkProjectList', {
    method: 'POST',
    body: params
  });
}

export async function update(params) {
  return request('checkProject/editCheckProject', {
    method: 'POST',
    body: params
  });
}

export async function setStatus(params) {
  return request('checkProject/adjustmentStatus', {
    method: 'POST',
    body: params
  });
}
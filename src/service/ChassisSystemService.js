import request from '@/utils/request';

export async function add(params) {
  return request('failureMode/saveFailureMode', {
    method: 'POST',
    body: params
  });
}

export async function fetch(params) {
  return request('failureMode/failureModeList', {
    method: 'POST',
    body: params
  });
}

export async function update(params) {
  return request('failureMode/updateFailureMode', {
    method: 'POST',
    body: params
  });
}

export async function review(params) {
  return request('failureMode/reviewFailureMode', {
    method: 'POST',
    body: params
  });
}

export async function del(params) {
  return request('failureMode/delFailureMode', {
    method: 'POST',
    body: params
  });
}

export async function operateLog(params) {
  return request('failureMode/failureModeOperateLog', {
    method: 'POST',
    body: params
  });
}

export async function info(params) {
  return request('failureMode/failureModeInfo', {
    method: 'POST',
    body: params
  });
}
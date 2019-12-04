import request from '@/utils/request';

export async function add(params) {
  return request('component/saveCoreComponent', {
    method: 'POST',
    body: params
  });
}

export async function fetch(params) {
  return request('component/coreComponentList', {
    method: 'POST',
    body: params
  });
}

export async function update(params) {
  return request('component/editAssemblyComponent', {
    method: 'POST',
    body: params
  });
}

export async function info(params) {
  return request('component/coreComponentInfo', {
    method: 'POST',
    body: params
  });
}
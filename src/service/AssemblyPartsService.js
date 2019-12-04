import request from '@/utils/request';

export async function add(params) {
  return request('component/saveAssemblyComponent', {
    method: 'POST',
    body: params
  });
}

export async function fetch(params) {
  return request('component/assemblyComponentList', {
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
  return request('component/assemblyComponentInfo', {
    method: 'POST',
    body: params
  });
}


export async function systemComponent(params) {
  return request('component/systemComponent', {
    method: 'POST',
    body: params
  });
}
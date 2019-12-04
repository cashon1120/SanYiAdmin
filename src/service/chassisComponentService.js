import request from '@/utils/request';

export async function add(params) {
  return request('component/saveSecondaryComponent', {
    method: 'POST',
    body: params
  });
}


export async function fetchVehicleSystem(params) {
  return request('component/vehicleSystem', {
    method: 'POST',
    body: params
  });
}

export async function fetchOptionLogs(params) {
  return request('component/optionLogs', {
    method: 'POST',
    body: params
  });
}

export async function downLoad(params) {
  return request('upload/download', {
    method: 'POST',
    body: params
  });
}

export async function fetchSystem(params) {
  return request('component/systemComponent', {
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


export async function del(params) {
  return request('component/delComponent', {
    method: 'POST',
    body: params
  });
}


export async function info(params) {
  return request('component/secondaryComponentInfo', {
    method: 'POST',
    body: params
  });
}
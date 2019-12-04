import request from '@/utils/request';

export async function add(params) {
  return request('vehicleModel/vehicleModel', {
    method: 'POST',
    body: params
  });
}

export async function fetch(params) {
  return request('vehicleModel/vehicleModelList', {
    method: 'POST',
    body: params
  });
}

export async function update(params) {
  return request('vehicleModel/editVehicleModelInfo', {
    method: 'POST',
    body: params
  });
}

export async function setStatus(params) {
  return request('vehicleModel/adjustmentVehicleModelStatus', {
    method: 'POST',
    body: params
  });
}
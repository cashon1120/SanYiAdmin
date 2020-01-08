import request from '@/utils/request';

export async function uploadBanner(params) {
  return request('/sysDict/confIndexVehicle', {
    method: 'POST',
    body: params
  });
}

export async function getBanner(params) {
  return request('/sysDict/indexVehicle', {
    method: 'POST',
    body: params
  });
}
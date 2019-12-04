import request from '@/utils/request';

export async function importForExcel(params) {
    return request('failureMode/importForExcel', {
      method: 'POST',
      body: params
    });
  }
import request from '@/utils/request';

export async function addCar(payload) {
    return request({
        url: 'vehicleModel/vehicleModel',
        method: 'POST',
        data: {
            ...payload
        }
    })
}

export async function findAllSTallyItemByStatus(payload) {
    return request({
        url: 's/tally/item/findAllSTallyItemByStatus',
        method: 'POST',
        data: {
            ...payload
        }
    })
}

export async function selectSTallyItem(payload) {
    return request({
        url: 's/tally/item/selectSTallyItem',
        method: 'POST',
        data: {
            ...payload
        }
    })
}

export async function add(payload) {
    return request({
        url: 's/tally/item/add',
        method: 'POST',
        data: {
            ...payload
        }
    })
}

export async function update(payload) {
    return request({
        url: 's/tally/item/update',
        method: 'Put',
        data: {
            ...payload
        }
    })
}
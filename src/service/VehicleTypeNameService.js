import request from "@/utils/request";

export async function findAllSVehicleType(payload) {
    return request({
        url: 's/vehicle/type/findAllSVehicleType',
        method: 'POST',
        data: {
            ...payload
        }
    })
}

export async function findAllSVehicleTypeByStatus(payload) {
    return request({
        url: 's/vehicle/type/findAllSVehicleTypeByStatus',
        method: 'POST',
        data: {
            ...payload
        }
    })
}

export async function selectVehicleType(payload) {
    return request({
        url: 's/vehicle/type/selectVehicleType',
        method: 'POST',
        data: {
            ...payload
        }
    })
}

export async function add(payload) {
    return request({
        url: 's/vehicle/type/add',
        method: 'POST',
        data: {
            ...payload
        }
    })
}

export async function update(payload) {
    return request({
        url: 's/vehicle/type/update',
        method: 'Put',
        data: {
            ...payload
        }
    })
}
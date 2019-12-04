import request from "@/utils/request";

export async function selectFaultInfo(payload) {
    return request({
        url: 'fault/info/selectFaultInfo',
        method: 'POST',
        data: {
            ...payload
        }
    })
}

export async function addFaultAndMultimedia(payload) {
    return request({
        url: 'fault/info/addFaultAndMultimedia',
        method: 'POST',
        data: {
            ...payload
        }
    })
}

export async function update(payload) {
    return request({
        url: 'fault/info/update',
        method: 'PUT',
        data: {
            ...payload
        }
    })
}

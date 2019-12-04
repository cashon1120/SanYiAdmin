import request from "@/utils/request";

export async function findAllSTallySystem(payload) {
    return request({
        url: 's/tally/system/findAllSTallySystem',
        method: 'POST',
        data: {
            ...payload
        }
    })
}

export async function findAllSTallySystemByStatus(payload) {
    return request({
        url: 's/tally/system/findAllSTallySystemByStatus',
        method: 'POST',
        data: {
            ...payload
        }
    })
}

export async function selectSTallySystem(payload) {
    return request({
        url: 's/tally/system/selectSTallySystem',
        method: 'POST',
        data: {
            ...payload
        }
    })
}

export async function add(payload) {
    return request({
        url: 's/tally/system/add',
        method: 'POST',
        data: {
            ...payload
        }
    })
}

export async function update(payload) {
    return request({
        url: 's/tally/system/update',
        method: 'Put',
        data: {
            ...payload
        }
    })
}
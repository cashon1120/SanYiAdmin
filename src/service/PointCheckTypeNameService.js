import request from "@/utils/request";

export async function findAllSTallyType(payload) {
    return request({
        url: 's/tally/type/findAllSTallyType',
        method: 'POST',
        data: {
            ...payload
        }
    })
}

export async function selectSTallyType(payload) {
    return request({
        url: 's/tally/type/selectSTallyType',
        method: 'POST',
        data: {
            ...payload
        }
    })
}

export async function add(payload) {
    return request({
        url: 's/tally/type/add',
        method: 'POST',
        data: {
            ...payload
        }
    })
}

export async function update(payload) {
    return request({
        url: 's/tally/type/update',
        method: 'Put',
        data: {
            ...payload
        }
    })
}
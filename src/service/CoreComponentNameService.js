import request from "@/utils/request";

export async function findAllSCoreParts(payload) {
    return request({
        url: 's/core/parts/findAllSCoreParts',
        method: 'POST',
        data: {
            ...payload
        }
    })
}

export async function findAllSCorePartsByStatus(payload) {
    return request({
        url: 's/core/parts/findAllSCorePartsByStatus',
        method: 'POST',
        data: {
            ...payload
        }
    })
}

export async function selectSCoreParts(payload) {
    return request({
        url: 's/core/parts/selectSCoreParts',
        method: 'POST',
        data: {
            ...payload
        }
    })
}

export async function add(payload) {
    return request({
        url: 's/core/parts/add',
        method: 'POST',
        data: {
            ...payload
        }
    })
}

export async function update(payload) {
    return request({
        url: 's/core/parts/update',
        method: 'Put',
        data: {
            ...payload
        }
    })
}
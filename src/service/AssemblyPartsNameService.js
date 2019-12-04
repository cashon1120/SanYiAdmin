import request from "@/utils/request";

export async function findAllSAssemblyParts(payload) {
    return request({
        url: 's/assembly/parts/findAllSAssemblyParts',
        method: 'POST',
        data: {
            ...payload
        }
    })
}

export async function findAllSAssemblyPartsByStatus(payload) {
    return request({
        url: 's/assembly/parts/findAllSAssemblyPartsByStatus',
        method: 'POST',
        data: {
            ...payload
        }
    })
}

export async function selectSAssemblyParts(payload) {
    return request({
        url: 's/assembly/parts/selectSAssemblyParts',
        method: 'POST',
        data: {
            ...payload
        }
    })
}

export async function add(payload) {
    return request({
        url: 's/assembly/parts/add',
        method: 'POST',
        data: {
            ...payload
        }
    })
}

export async function update(payload) {
    return request({
        url: 's/assembly/parts/update',
        method: 'Put',
        data: {
            ...payload
        }
    })
}
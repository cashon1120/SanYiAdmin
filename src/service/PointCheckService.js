import request from "@/utils/request";

export async function selectTallyInfo(payload) {
    return request({
        url: 'tally/info/selectTallyInfo',
        method: 'POST',
        data: {
            ...payload
        }
    })
}

export async function selectTallyInfoDis(payload) {
    return request({
        url: 'tally/info/selectTallyInfoDis',
        method: 'POST',
        data: {
            ...payload
        }
    })
}

export async function add(payload) {
    return request({
        url: 'tally/info/add',
        method: 'POST',
        data: {
            ...payload
        }
    })
}

export async function update(payload) {
    return request({
        url: 'tally/info/update',
        method: 'Put',
        data: {
            ...payload
        }
    })
}

export async function updateByTallyNo(payload) {
    return request({
        url: 'tally/info/updateByTallyNo',
        method: 'Put',
        data: {
            ...payload
        }
    })
}
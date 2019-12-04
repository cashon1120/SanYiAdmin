import request from "@/utils/request";

export async function findAllSChassis(payload) {
    return request({
        url: 's/chassis/findAllSChassis',
        method: 'POST',
        data: {
            ...payload
        }
    })
}
import request from "@/utils/request";

export function baiduGenGrid(params){
    return request({
        url: '/api/baidu/v4/grid',
        headers: {
            'Content-Type': 'application/json'
        },
        timeout: 60 * 60 * 1000,
        method: 'post',
        data: params
    })
}

export function getPath(){
    return request({
        url: '/api/route',
        method: 'get'
    })
}

export function uploadPoints(data){
    return request({
        url: '/api/baidu/upload/points',
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'post',
        data: data
    })
}
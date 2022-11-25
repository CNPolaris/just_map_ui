import request from "@/utils/request";

export function baiduGenGrid(){
    return request({
        url: '/api/baidu/grid',
        method: 'get'
    })
}

export function baiduGenGrid2() {
    return request({
        url: '/api/baidu/v2/grid/',
        method: 'get'
    })
}

export function baiduGenGrid3() {
    return request({
        url: '/api/baidu/v3/grid',
        method: 'get'
    })
}

export function baiduGenGrid4(params) {
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
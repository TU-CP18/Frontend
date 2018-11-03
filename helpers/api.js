import axios from 'axios';
import Api from '../constants';
// import fakeApi from './fakeApi';

const BASE_URL = Api.host;

const request = (method, url, bodyParams, queryParams) => {
    const state = global.store.getState();

    // TODO: implement together with dev settings screen and store
    // if (state.devSettings.get('fakeApi')) {
    //     const response = fakeApi(method, url, bodyParams, queryParams);
    //     if (response) return response;
    // }

    method = method.toUpperCase();

    let options = {
        method: method,
        url: BASE_URL + url,
        responseType: 'json',
        headers: {},
    }

    if (bodyParams && (method === 'PUT' || method === 'POST' || method === 'PATCH')) {
        options['data'] = bodyParams;
    }
    
    if (queryParams) {
        options['params'] = queryParams;
    }

    if (global.token && global.token.length > 10) {
        options['headers']['Authorization'] = 'Bearer ' + global.token;
    }

    return axios(options);
}

export const get = (url, queryParams) => {
    return request('get', url, queryParams);
}

export const post = (url, bodyParams, queryParams) => {
    return request('post', url, bodyParams, queryParams);
}

export const put = (url, bodyParams, queryParams) => {
    return request('put', url, bodyParams, queryParams);
}

export const patch = (url, bodyParams, queryParams) => {
    return request('patch', url, bodyParams, queryParams);
}

export default {
    get, post, put, patch
}
import axios from 'axios';
import Api from '../constants/Api';
import fakeApi from './fakeApi';

const BASE_URL = Api.host;

const request = (method, url, bodyParams, queryParams) => {

    if (global.devSettings.settings.get('fakeApi')) {
        const response = fakeApi(method, url, bodyParams, queryParams);
        if (response) return response;
    }

    method = method.toUpperCase();

    let options = {
        method: method,
        url: BASE_URL + url,
        responseType: 'json',
        headers: {},
    }

    if (bodyParams && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
        options['data'] = bodyParams;
    }
    
    if (queryParams) {
        options['params'] = queryParams;
    }

    if (global.userStore.authenticated) {
        // all api endpoints expect the authToken to be transferred in the authorization header
        options['headers']['Authorization'] = `Bearer ${global.userStore.authToken}`;
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
};
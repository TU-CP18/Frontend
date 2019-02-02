import axios from 'axios';
import Api from '../constants/Api';
import fakeApi from './fakeApi';

const BASE_URL = Api.host;

const request = (method, url, bodyParams, queryParams, queryHeaders) => {
  if (global.devSettings.settings.get('fakeApi')) {
    const response = fakeApi(method, url, bodyParams, queryParams);
    if (response) return response;
  }

  const verb = method.toUpperCase();

  const options = {
    method: verb,
    baseURL: BASE_URL,
    url: url,
    responseType: 'json',
    headers: {},
  };

  if (bodyParams && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(verb)) {
    options.data = bodyParams;
  }

  if (queryParams) {
    options.params = queryParams;
  }

  if (queryHeaders) {
    options.headers = queryHeaders;
  }

  if (global.userStore.authenticated) {
    // all api endpoints expect the authToken to be transferred in the authorization header
    options.headers.Authorization = `Bearer ${global.userStore.authToken}`;
  }

  console.log('options', options);

  return axios(options);
};

const get = (url, queryParams) => request('get', url, null, queryParams, {});
const post = (url, bodyParams, queryParams, queryHeaders) => request('post', url, bodyParams, queryParams, queryHeaders);
const put = (url, bodyParams, queryParams) => request('put', url, bodyParams, queryParams, {});
const patch = (url, bodyParams, queryParams) => request('patch', url, bodyParams, queryParams, {});

export default {
  get, post, put, patch,
};

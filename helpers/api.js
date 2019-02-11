import axios from 'axios';
import Api from '../constants/Api';
import fakeApi from './fakeApi';

const request = (method, url, bodyParams, urlParams, headers = {}) => {
  if (global.devSettings.settings.get('fakeApi')) {
    const response = fakeApi(method, url, bodyParams, urlParams);
    if (response) return response;
  }

  const verb = method.toUpperCase();
  const baseUrl = Api.devMode && !global.devSettings.settings.get('productionApi')
    ? Api.devHost
    : Api.prodHost;

  const options = {
    method: verb,
    baseURL: baseUrl,
    url: url,
    responseType: 'json',
    headers: headers,
  };

  if (bodyParams && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(verb)) {
    options.data = bodyParams;
  }

  if (urlParams) {
    options.params = urlParams;
  }

  if (global.userStore.authToken) {
    // all api endpoints expect the authToken to be transferred in the authorization header
    options.headers.Authorization = `Bearer ${global.userStore.authToken}`;
  }

  return axios(options);
};

const get = (url, urlParams) => request('get', url, null, urlParams);
const post = (url, bodyParams, urlParams, headers) => request('post', url, bodyParams, urlParams, headers);
const put = (url, bodyParams, urlParams) => request('put', url, bodyParams, urlParams);
const patch = (url, bodyParams, urlParams) => request('patch', url, bodyParams, urlParams);

export default {
  get, post, put, patch,
};

export default (method, url, bodyParams, queryParams) => {
  if (url === '/session' && method === 'post') {
    if (bodyParams.username !== 'John' || bodyParams.password !== '1') {
      return Promise.resolve({
        status: 403,
      });
    }

    return Promise.resolve({
      status: 200,
      data: {
        id_token: '123',
      },
    });
  }

  return false;
};

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
        id_token: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkcml2ZXIiLCJhdXRoIjoiUk9MRV9BRE1JTixST0xFX1VTRVIiLCJleHAiOjE1NDM2MDExODJ9.-ZyCO7ckIR14-snxQ9HrhmLEHP32C-mQPmfGKNXEtj-kKfk8e2cdPnwnCjZ7ww8pFn5dRelmcpsjGEtkJMPNQw',
      },
    });
  }

  return false;
};

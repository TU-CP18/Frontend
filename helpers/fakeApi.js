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
        id_token: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkcml2ZXIiLCJhdXRoIjoiUk9MRV9BRE1JTixST0xFX1VTRVIiLCJleHAiOjE1NDYyMDgwMTV9.UTz2kK_iz7FItXSRuUkH-lGLvHVgX4885QL5qfz6jyzOm6jAiKZ1vwGsMKCS1TTLj9LwC7mboiHnRp2scc-qJg',
      },
    });
  }

  return false;
};

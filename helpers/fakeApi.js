import moment from 'moment';

const carIssues = [
  {
    id: 1,
    description: 'A small dent is visible',
    part: 'front/Bonnet',
    posX: 621.8804347826087,
    posY: 258.35869565217394,
  },
];

export default (method, url, bodyParams, queryParams) => {
  if (url === '/authenticate' && method === 'post') {
    return Promise.resolve({
      status: 200,
      data: {
        id_token: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkcml2ZXIiLCJhdXRoIjoiUk9MRV9BRE1JTixST0xFX1VTRVIiLCJleHAiOjE1NDYyMDgwMTV9.UTz2kK_iz7FItXSRuUkH-lGLvHVgX4885QL5qfz6jyzOm6jAiKZ1vwGsMKCS1TTLj9LwC7mboiHnRp2scc-qJg',
      },
    });
  }

  if (url === '/account' && method === 'get') {
    return Promise.resolve({
      status: 200,
      data: {
        id: 1,
        firstname: 'John',
        lastname: 'Snow',
      },
    });
  }

  if (url === '/shifts/user/next' && method === 'get') {
    return Promise.resolve({
      status: 200,
      data: {
        id: 2,
        car: {
          id: 1,
        },
        latStart: 52.5228096,
        longStart: 13.4087783,
        start: moment().add(85, 'minutes').toISOString(),
        address: {
          name: 'Rosa-Luxemburg-Straße',
          postalCode: 10178,
          city: 'Berlin',
        },
      },
    });
  }

  if (url === '/shifts/user/all' && method === 'get') {
    return Promise.resolve({
      status: 200,
      data: [
        {
          id: 2,
          car: 1,
          latStart: 52.5228096,
          longStart: 13.4087783,
          start: moment().add(85, 'm').toISOString(),
          end: moment().add(85, 'm').add(4, 'h').toISOString(),
          address: {
            name: 'Rosa-Luxemburg-Straße',
            postalCode: 10178,
            city: 'Berlin',
          },
        },
        {
          id: 3,
          car: 2,
          latStart: 52.5228096,
          longStart: 13.4087783,
          start: moment().add(8, 'h').toISOString(),
          end: moment().add(8, 'h').add(4, 'h').toISOString(),
          address: {
            name: 'Rosa-Luxemburg-Straße',
            postalCode: 10178,
            city: 'Berlin',
          },
        },
        {
          id: 4,
          car: 4,
          latStart: 52.5228096,
          longStart: 13.4087783,
          start: moment().add(2, 'd').toISOString(),
          end: moment().add(2, 'd').add(3, 'h').add(30, 'm').toISOString(),
          address: {
            name: 'Rosa-Luxemburg-Straße',
            postalCode: 10178,
            city: 'Berlin',
          },
        },
      ],
    });
  }

  if (url === '/cars/1/issues' && method === 'get') {
    return Promise.resolve({
      status: 200,
      data: carIssues,
    });
  }

  if (url === '/cars/1/issues' && method === 'post') {
    carIssues.push({
      id: Date.now(),
      posX: bodyParams.posX,
      posY: bodyParams.posY,
      part: bodyParams.part,
      description: bodyParams.description,
    });

    return Promise.resolve({
      status: 200,
      data: {
        id: Date.now(),
        posX: bodyParams.posX,
        posY: bodyParams.posY,
        part: bodyParams.part,
        description: bodyParams.description,
      },
    });
  }

  if (url === '/shifts/2/authorize' && method === 'post') {
    return Promise.resolve({
      status: 200,
    });
  }

  if (url === '/car-cleanlinesses' && method === 'post') {
    return Promise.resolve({
      status: 200,
    });
  }

  return false;
};

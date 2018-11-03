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
                token: '123',
                name: 'John Snow'
            },
        });
    }

    return false;
};
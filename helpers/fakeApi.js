export default (method, url, bodyParams, queryParams) => {
    if (url === '/storage_units' && method === 'get') {
        return Promise.resolve({
            status: 200,
            data: {

            },
        });
    }

    return false;
};
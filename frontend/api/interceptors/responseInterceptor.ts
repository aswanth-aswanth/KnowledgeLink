import { AxiosResponse } from 'axios';

const responseInterceptor = (response: AxiosResponse) => {

    // console.log('Response received:', response);
    console.group("ResponseInterceptor");
    console.log('Response data:', response.data);
    console.log('Response status:', response.status);
    console.groupEnd();
    // console.log('Response headers:', response.headers);
    // console.log('Response config:', response.config);

    return response;
};

export default responseInterceptor;
const errorInterceptor = (error: any) => {
    console.error('Error occurred:', error);
    return Promise.reject(error);
};

export default errorInterceptor;
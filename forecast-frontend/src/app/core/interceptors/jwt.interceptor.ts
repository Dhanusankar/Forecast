import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (request, next) => {
  const token = localStorage.getItem('auth_token');

  if (token && request.url.includes('forecast-1-tpoj.onrender.com')) {
    console.log('Adding JWT token to request:', request.url);
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  } else if (!token) {
    console.warn('No token found in localStorage');
  }

  return next(request);
};

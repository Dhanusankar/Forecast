import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (request, next) => {
  // Don't add token to login/register endpoints
  if (request.url.includes('/auth/login') || request.url.includes('/auth/register')) {
    return next(request);
  }

  const token = localStorage.getItem('auth_token');

  if (token) {
    console.log('Adding JWT token to request:', request.url);
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  } else {
    console.warn('No token found in localStorage');
  }

  return next(request);
};

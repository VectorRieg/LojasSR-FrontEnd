import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

let activeRequests = 0;

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  activeRequests++;
  // Aqui você pode emitir um evento para mostrar loading spinner

  return next(req).pipe(
    finalize(() => {
      activeRequests--;
      // Se activeRequests === 0, esconder loading spinner
    })
  );
};

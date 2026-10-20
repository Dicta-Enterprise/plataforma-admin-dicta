import { HttpInterceptorFn } from '@angular/common/http';

// Agrega withCredentials a TODAS las peticiones del panel, de una sola vez -- sin esto, el
// navegador no manda la cookie de sesión (accessToken) hacia back-nest/back-auth, aunque el
// login ya se haya hecho. Así cualquier servicio nuevo que llame a un endpoint que exija
// sesión ya funciona, sin tener que acordarse de agregarlo cada vez.
export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req.clone({ withCredentials: true }));
};

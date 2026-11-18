// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  // Apunta al back-nest real (master), donde viven Cursos/Módulos y Astronautas. OJO: mientras
  // esto apunte aqui, Usuarios/Progreso/Facturas (que solo existen en la rama de prueba, puerto
  // 3005) van a dar error de conexion -- esas ramas todavía no se han mergeado a master.
  URL_NEST_BACKEND: 'http://localhost:3000/api',
  // back-auth-dicta corre en el puerto 3002.
  URL_NEST_AUTH: 'http://localhost:3002/api',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

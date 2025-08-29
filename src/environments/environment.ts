// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  ////Puertos para el Backend Local
  URL_BACKEND:'https://localhost:7098/api',
  URL_AUTH:'https://localhost:7262/api',

  ////Puertos Para Docker Local
  // URL_BACKEND: 'http://localhost:7098/api',
  // URL_AUTH: 'http://localhost:7262/api',

  //Puertos Para Docker en Produccion
  // URL_BACKEND: 'http://localhost:32228/api',
  // URL_AUTH: 'http://localhost:32028/api',

  //Puertos Para Google Cloud sin SSL
  // URL_BACKEND: ' http://34.111.97.158/api',
  // URL_AUTH: 'http://34.117.194.62/api',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

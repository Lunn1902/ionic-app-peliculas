// environment.prod.ts
//
// En producción el frontend NO conoce el API Key de TMDB.
// Las peticiones van a /api/*, que el netlify.toml redirige
// a la función serverless tmdb-proxy.js, donde el API Key
// existe solo como variable de entorno de Netlify (en el servidor).
//
// La imgPath sigue apuntando directo a TMDB porque las imágenes
// son recursos públicos que no requieren autenticación.
export const environment = {
  production: true,
  url: '/api',
  apikey: '',          // Vacío a propósito: el proxy lo inyecta server-side
  imgPath: 'https://image.tmdb.org/t/p',
};

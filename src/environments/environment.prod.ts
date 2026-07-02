// En producción el frontend NO conoce el API Key de TMDB.
// Las peticiones van a /api/*, que el netlify.toml redirige
// a la función serverless tmdb-proxy.js, donde el API Key
// existe solo como variable de entorno de Netlify (en el servidor).
//
// La imgPath sigue apuntando directo a TMDB porque las imágenes
// son recursos públicos que no requieren autenticación.

export const environment = {
  production: true,
  url: '/api',          // <-- EL CAMBIO ESTÁ AQUÍ. Esto activa el proxy de Netlify.
  apiKey: '',           // Vacío a propósito
  imgPath: 'https://image.tmdb.org/t/p'
};

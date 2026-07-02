/**
 * netlify/functions/tmdb-proxy.js
 *
 * Proxy serverless para The Movie Database (TMDB) API v3.
 *
 * ¿Por qué existe este archivo?
 * Si el frontend hace peticiones directamente a api.themoviedb.org,
 * el API Key queda expuesto en el bundle de JavaScript que el navegador
 * descarga — cualquier persona puede abrirlo con las DevTools y robarlo.
 * Al pasar las peticiones por aquí, el API Key vive solo en las variables
 * de entorno de Netlify (en el servidor), y el navegador nunca lo ve.
 *
 * Flujo de una petición:
 *   Navegador → GET /api/discover/movie?sort_by=popularity.desc&page=1
 *   → netlify.toml redirige a /.netlify/functions/tmdb-proxy
 *   → Esta función extrae el path, inyecta el API Key, llama a TMDB
 *   → Devuelve el JSON de TMDB al navegador sin modificarlo
 *
 * Variable de entorno requerida en Netlify:
 *   TMDB_API_KEY = tu API Key v3 de themoviedb.org/settings/api
 */

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

exports.handler = async (event) => {

  // 1. EXTRAER EL PATH REAL DE TMDB
  // La URL que llega aquí tiene la forma:
  //   /.netlify/functions/tmdb-proxy/discover/movie?sort_by=...
  // El netlify.toml ya eliminó el prefijo /api, por lo que `event.path`
  // contiene la parte después de /api. Limpiamos el prefijo de la función.
  const functionPrefix = '/.netlify/functions/tmdb-proxy';
  const tmdbPath = event.path.startsWith(functionPrefix)
    ? event.path.slice(functionPrefix.length)
    : event.path;

  // 2. LEER EL API KEY DESDE LAS VARIABLES DE ENTORNO
  // En desarrollo local (`netlify dev`), Netlify CLI lee este valor
  // de un archivo .env en la raíz del proyecto.
  // En producción, viene de Site Settings → Environment Variables en Netlify.
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'TMDB_API_KEY no está configurado en las variables de entorno.',
      }),
    };
  }

  // 3. CONSTRUIR LA URL COMPLETA HACIA TMDB
  // Los query params del frontend (sort_by, page, query, etc.) vienen en
  // event.queryStringParameters. Los convertimos a un URLSearchParams
  // y les sumamos el api_key y los parámetros de idioma.
  const params = new URLSearchParams(event.queryStringParameters || {});
  params.set('api_key', apiKey);
  params.set('language', 'es');
  params.set('include_image_language', 'es');

  const tmdbUrl = `${TMDB_BASE_URL}${tmdbPath}?${params.toString()}`;

  // 4. EJECUTAR LA PETICIÓN A TMDB
  // fetch() es nativo a partir de Node 18. Netlify usa Node 18+ por defecto,
  // por lo que no necesitamos instalar node-fetch ni ninguna dependencia extra.
  try {
    const response = await fetch(tmdbUrl, {
      method: 'GET',
      headers: {
        // Header de seguridad adicional que TMDB acepta; no es obligatorio
        // para v3 pero es buena práctica identificar al cliente.
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    // 5. DEVOLVER LA RESPUESTA AL FRONTEND
    // Pasamos el status de TMDB tal cual (200, 404, 401, etc.) para que
    // el servicio Angular pueda manejar los errores de la misma forma
    // que lo haría si llamara directo a TMDB.
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        // Permite que el frontend en cualquier origen (útil en desarrollo)
        // reciba la respuesta. En producción Netlify ya sirve ambos
        // (función + SPA) desde el mismo dominio, así que esto es solo
        // por si haces `ng serve` local apuntando a la función en Netlify.
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data),
    };

  } catch (error) {
    // Error de red (TMDB caído, DNS, timeout, etc.)
    return {
      statusCode: 502,
      body: JSON.stringify({
        error: 'Error al conectar con TMDB.',
        detalle: error.message,
      }),
    };
  }
};

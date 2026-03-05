export default ({ env }) => {
  const normalizeOrigin = (origin: string) => origin.trim().replace(/\/+$/, '');
  const extractRequestOrigin = (originOrContext: unknown): string | null => {
    if (typeof originOrContext === 'string') return originOrContext;

    if (originOrContext && typeof originOrContext === 'object') {
      const context = originOrContext as {
        request?: { header?: { origin?: string } };
        headers?: { origin?: string };
      };

      const contextOrigin = context.request?.header?.origin ?? context.headers?.origin;
      if (typeof contextOrigin === 'string') return contextOrigin;
    }

    return null;
  };

  const envOrigins = env('CORS_ORIGINS', '')
    .split(',')
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean);

  const frontendUrl = normalizeOrigin(env('FRONTEND_URL', ''));

  const exactOrigins = new Set([
    ...envOrigins,
    ...(frontendUrl ? [frontendUrl] : []),
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001',
  ]);

  const railwayRegex = /^https:\/\/.*\.railway\.app$/;
  const localhostRegex = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

  return [
    'strapi::logger',
    'strapi::errors',
    'strapi::security',
    {
      name: 'strapi::cors',
      config: {
        origin: (originOrContext) => {
          const requestOrigin = extractRequestOrigin(originOrContext);
          if (!requestOrigin) return false;

          const normalizedRequestOrigin = normalizeOrigin(requestOrigin);

          if (exactOrigins.has(normalizedRequestOrigin)) return normalizedRequestOrigin;
          if (localhostRegex.test(normalizedRequestOrigin)) return normalizedRequestOrigin;
          if (railwayRegex.test(normalizedRequestOrigin)) return normalizedRequestOrigin;

          return false;
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
        headers: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With'],
        keepHeaderOnError: true,
      },
    },
    'strapi::poweredBy',
    'strapi::query',
    'strapi::body',
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
  ];
};
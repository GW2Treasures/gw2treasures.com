import * as Sentry from '@sentry/node';

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    release: process.env.SENTRY_RELEASE,
    environment: process.env.SENTRY_ENVIRONMENT || 'unknown',

    tracesSampleRate: 0.1,
    integrations: [
      Sentry.prismaIntegration(),
    ],
  });
}

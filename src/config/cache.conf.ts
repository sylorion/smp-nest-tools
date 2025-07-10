import { registerAs } from '@nestjs/config';
import * as fs from 'fs';

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export default registerAs('cache', () => {
  const isSecureEnv =
    process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';

  const tlsOptions = isSecureEnv
    ? {
        cert: fs.readFileSync(requiredEnv('CERT_PATH')),
        key: fs.readFileSync(requiredEnv('KEY_PATH')),
        ca: [fs.readFileSync(requiredEnv('CA_PATH'))],
        rejectUnauthorized: true,
      }
    : undefined;

  return {
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      ttl: parseInt(process.env.REDIS_TTL_SEC || '86400', 10),
      ...(tlsOptions && { tls: tlsOptions }),
    },

    memory: {
      ttl: parseInt(process.env.MEMORY_TTL_SEC || '300', 10),
      max: 1000,
    },
  };
});

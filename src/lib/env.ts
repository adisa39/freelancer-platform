export const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_INTERLINK_APP_ID: process.env.NEXT_PUBLIC_INTERLINK_APP_ID,
  INTERLINK_APP_ID: process.env.INTERLINK_APP_ID,
  NODE_ENV: process.env.NODE_ENV,
};

export function getJwtSecret(): string {
  const secret = env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be configured with at least 32 characters.');
  }
  return secret;
}

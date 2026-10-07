export const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_INTERLINK_APP_ID: process.env.NEXT_PUBLIC_INTERLINK_APP_ID,
  INTERLINK_APP_ID: process.env.INTERLINK_APP_ID,
  NODE_ENV: process.env.NODE_ENV,
  CHAIN_ID: Number(process.env.NEXT_PUBLIC_CHAIN_ID || 19042026),
  INTERLINK_RPC: process.env.INTERLINK_RPC || 'https://evm-rpc.test-net.interlinklabs.ai/v1',
  DEV_MOCK_AUTH: process.env.DEV_MOCK_AUTH === 'true',
  DEV_MOCK_ROLE: process.env.DEV_MOCK_ROLE,
};

export function getJwtSecret(): string {
  const secret = env.JWT_SECRET;
  if (!secret || secret.length < 32 || /replace|change|example/i.test(secret)) {
    throw new Error('JWT_SECRET must be a unique secret with at least 32 characters.');
  }
  return secret;
}

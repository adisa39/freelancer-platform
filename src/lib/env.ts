export const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_INTERLINK_APP_ID: process.env.NEXT_PUBLIC_INTERLINK_APP_ID,
  INTERLINK_APP_ID: process.env.INTERLINK_APP_ID,
  NODE_ENV: process.env.NODE_ENV,
  CHAIN_ID: process.env.CHAIN_ID || 19042026,
  INTERLINK_RPC: process.env.INTERLINK_RPC || "https://evm-rpc.test-net.interlinklabs.ai/v1"
};

export function getJwtSecret(): string {
  const secret = env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be configured with at least 32 characters.');
  }
  return secret;
}

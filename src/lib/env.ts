export const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_INTERLINK_APP_ID: process.env.NODE_ENV==="development" ? 
    "1234TESTITL" : 
    process.env.NEXT_PUBLIC_INTERLINK_APP_ID,
  INTERLINK_APP_ID:  process.env.NODE_ENV==="development" ? 
    "1234TESTITL" : 
    process.env.INTERLINK_APP_ID,
  NODE_ENV: process.env.NODE_ENV,
}
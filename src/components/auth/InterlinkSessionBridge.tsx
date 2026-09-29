'use client';

import { env } from '@/lib/env';
import { Mdk2 } from '@interlinklabs/mdk';

const APP_ID = env.NEXT_PUBLIC_INTERLINK_APP_ID;

export default function InterlinkSessionBridge() {
  if (!APP_ID) return null;
  return <Mdk2 appid={APP_ID} onSuccess={() => undefined} onFailure={() => undefined}>{() => <span hidden />}</Mdk2>;
}

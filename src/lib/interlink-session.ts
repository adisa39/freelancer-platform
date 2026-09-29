'use client';

import { Mdk2 } from '@interlinklabs/mdk';

export async function signOutFromInterlink() {
  const appId = process.env.NEXT_PUBLIC_INTERLINK_APP_ID;
  if (appId) Mdk2.logOut(appId);
  await fetch('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify({ action: 'logout' }),
  });
}

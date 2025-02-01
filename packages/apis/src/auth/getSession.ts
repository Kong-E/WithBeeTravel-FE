'use server';

import { auth } from '@withbee/auth-config';

export async function getSession() {
  const session = await auth();

  return session;
}

export async function getAccessToken() {
  const session = await getSession();
  const accessToken = session?.user?.accessToken;

  return accessToken;
}

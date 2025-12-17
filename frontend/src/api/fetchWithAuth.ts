let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(host: string, refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
  const response = await fetch(`${host}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  if (!response.ok) throw new Error('Token refresh failed');
  return response.json();
}

export async function fetchWithAuth(
  url: string,
  options: RequestInit,
  token: string,
  refreshToken: string,
  host: string,
  onTokenRefresh: (newToken: string, newRefreshToken: string) => void
): Promise<Response> {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'x-auth-token': token,
    },
  });

  if (response.status !== 401) {
    return response;
  }
  if (!isRefreshing) {
    isRefreshing = true;
    refreshPromise = refreshAccessToken(host, refreshToken)
      .then((data) => {
        onTokenRefresh(data.accessToken, data.refreshToken);
        isRefreshing = false;
        return data.accessToken;
      })
      .catch((err) => {
        isRefreshing = false;
        refreshPromise = null;
        throw err;
      });
  }

  try {
    const newToken = await refreshPromise!;
    const retryResponse = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'x-auth-token': newToken,
      },
    });
    
    return retryResponse;
  } catch (err) {
    throw new Error('Session expired. Please login again.');
  }
}
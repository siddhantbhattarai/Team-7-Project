const storage: Storage | null = typeof window !== 'undefined' ? window.localStorage : null;

function jwtDecode(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  );

  return JSON.parse(jsonPayload);
}

export const getCurrentUser = (): any | null => {
  let user: any | null = null;
  const data = storage ? storage.getItem('currentUser') : '';
  if (data) user = JSON.parse(data);
  return user;
};

export const updateCurrentUser = (userData: any): void => {
  let user: any | null = null;
  const data = storage ? storage.getItem('currentUser') : '';
  if (data) user = JSON.parse(data);
  user = { ...user, ...userData };
  saveCurrentUser(user);
}

export const saveCurrentUser = (userData: any): void =>
  storage ? storage.setItem('currentUser', JSON.stringify(userData)) : undefined;

export const saveKey = (key: string): void =>
  storage ? storage.setItem('key', JSON.stringify(key)) : undefined;

export const getKey = (): string | null =>
  storage ? JSON.parse(storage.getItem('key') || 'null') : null;

export const getAccessToken = (): string | null =>
  storage ? storage.getItem('accessToken') : null;

export const getRefreshToken = (): string | null =>
  storage ? storage.getItem('refreshToken') : null;

export const saveAccessToken = (accessToken: string): void =>
  storage ? storage.setItem('accessToken', accessToken) : undefined;

export const saveRefreshToken = (refreshToken: string): void =>
  storage ? storage.setItem('refreshToken', refreshToken) : undefined;

export const deleteAccessToken = (): void =>
  storage ? storage.removeItem('accessToken') : undefined;

export const deleteRefreshToken = (): void =>
  storage ? storage.removeItem('refreshToken') : undefined;

export const clearStorage = (): void => {
  if (storage) {
    storage.clear();
  }
};

export const isValidToken = (accessToken: string | null): boolean => {
  if (!accessToken) {
    return false;
  }
  const decoded = jwtDecode(accessToken);

  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};
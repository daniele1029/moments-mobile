const ACCESS_TOKEN_KEY = "moments_access_token";

function canUseStorage() {
  return typeof window !== "undefined";
}

export const tokenService = {
  get() {
    if (!canUseStorage()) return null;

    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  set(token: string) {
    if (!canUseStorage()) return;

    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  clear() {
    if (!canUseStorage()) return;

    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  },
};

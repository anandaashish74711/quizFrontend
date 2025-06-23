export const logout = (redirectUrl: string) => {
  localStorage.clear();
  window.location.href = redirectUrl;
};


export const isApiError = (e: unknown): e is Error => {
  // TODO should be working with custom errors
  return true;
};
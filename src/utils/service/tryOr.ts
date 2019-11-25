export const tryOr = <T>(get: () => T, or: T) => {
  try {
    return get()
  } catch (e) {
    return or
  }
}

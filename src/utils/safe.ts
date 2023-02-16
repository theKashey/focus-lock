export const safeProbe = <T>(cb: () => T): T | undefined => {
  try {
    return cb();
  } catch (e) {
    return undefined;
  }
};

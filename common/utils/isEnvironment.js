export const isClient =
  typeof window !== 'undefined' && typeof window.document !== 'undefined';

export const isServer =
  typeof process !== 'undefined' &&
  process.versions != null &&
  process.versions.node != null;

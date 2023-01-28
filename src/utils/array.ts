/*
IE11 support
 */

interface ListOf<TNode> {
  length: number;
  [index: number]: TNode;
}

export const toArray = <T>(a: T[] | ListOf<T>): T[] => {
  const ret = Array(a.length);

  for (let i = 0; i < a.length; ++i) {
    ret[i] = a[i];
  }

  return ret;
};

export const asArray = <T>(a: T | T[]): T[] => (Array.isArray(a) ? a : [a]);

export const getFirst = <T>(a: T | T[]): T => (Array.isArray(a) ? a[0] : a);

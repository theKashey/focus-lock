export const toArray = a => {
  const ret = Array(a.length);
  for (let i = 0; i < a.length; i++) {
    ret[i] = a[i]
  }
  return ret;
};

export const arrayFind = (array, search) => array.filter(a => a === search)[0];


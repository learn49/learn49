const toCamel = (s: string) => {
  return s.toLowerCase().replace(/([-_][a-z])/gi, $1 => {
    return $1
      .toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });
};

const toSnake = (s: string) =>
  s
    .split(/(?=[A-Z])/)
    .join('_')
    .toLowerCase();

const keysToCamel = obj => {
  const keys = Object.keys(obj);
  const snakeObj = {};
  keys.forEach(key => {
    snakeObj[toCamel(key)] = obj[key];
  });
  return snakeObj;
};

const keysToSnake = obj => {
  const keys = Object.keys(obj);
  const snakeObj = {};
  keys.forEach(key => {
    snakeObj[toSnake(key)] = obj[key];
  });
  return snakeObj;
};

const listToCamel = arr => arr.map(keysToCamel);

export { keysToCamel, keysToSnake, listToCamel };

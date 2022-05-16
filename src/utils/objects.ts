/**
 * Credits to:
 * https://matthiashager.com/converting-snake-case-to-camel-case-object-keys-with-javascript
 */

/**
 * Transforms given string to camelCase
 */
export const toCamelCase = (s: string) => {
  return s.replace(/([-_][a-z])/gi, $1 => {
    return $1.toUpperCase().replace('-', '').replace('_', '');
  });
};

/**
 * Transforms given string to snake_case
 */
export const toSnakeCase = (str: string) => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

/**
 * Tests if a given object is array
 */
export const isArray = function (a: any) {
  return Array.isArray(a);
};

/**
 * Tests if a given object is an actual object and not e.g. array
 */
export const isObject = function (o: any) {
  return o === Object(o) && !isArray(o) && typeof o !== 'function';
};

export const transformKeys = (object: any, caseTransformer = toCamelCase) => {
  if (isObject(object)) {
    const objectCopy: any = {};

    Object.keys(object).forEach(key => {
      objectCopy[caseTransformer(key as string)] = transformKeys(
        object[key],
        caseTransformer
      );
    });

    return objectCopy;
  } else if (isArray(object)) {
    return object.map((item: any) => {
      return transformKeys(item, caseTransformer);
    });
  }

  return object;
};

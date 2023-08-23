export function convertToSnakeCase<T = Record<string, unknown>>(data: T) {
  const snakeCaseData = {};
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
      snakeCaseData[snakeKey] = data[key];
    }
  }
  return snakeCaseData;
}

export function convertToCamelCase<T = Record<string, unknown>>(data: T) {
  const camelCaseData = {};
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const camelKey = key.replace(/_(\w)/g, (_, letter) =>
        letter.toUpperCase()
      );
      camelCaseData[camelKey] = data[key];
    }
  }
  return camelCaseData as T;
}

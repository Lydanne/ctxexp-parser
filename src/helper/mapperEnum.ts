export function mapperEnum(enumParams) {
  for (const key in enumParams) {
    Object.defineProperty(enumParams, enumParams[key], {
      value: key,
      enumerable: false,
    });
  }
}

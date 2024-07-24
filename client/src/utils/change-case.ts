export function paramCase(str: string) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function snakeCase(str: string) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

export function capitalise(string: string) {
  return string[0].toUpperCase() + string.slice(1);
}

export function handleLongDescriptions(string: string) {
  if (string.split(' ').length > 4) {
    return `${string.slice(0, 20)}...`;
  }
  return string;
}

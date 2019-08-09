function camelCase(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function cleanKey(key) {
  return key
    .replace(/\d+\.\s+/gi, '')
    .split(' ')
    .map((v, i) => (i ? camelCase(v) : v))
    .join('');
}

export default function cleanKeys(apiObject = {}) {
  const cleanItem = {};
  for (const [key, val] of Object.entries(apiObject)) {
    cleanItem[cleanKey(key)] = val;
  }
  return cleanItem;
}

export function cleanCompanyName(name) {
  return name
    .toLowerCase()
    .replace('inc.', '')
    .replace('L.P.', '')
    .replace('technologies', '')
    .replace('ltd.', '')
    .replace('corporation', '')
    .replace('company', '')
    .replace('holdings', '')
    .replace('corp.', '')
    .replace('plc', '')
    .replace('s.a.', '')
    .replace('& co.', '')
    .replace('oyj', '')
    .trim();
}

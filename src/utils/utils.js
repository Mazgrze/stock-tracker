export default function cleanKeys(apiObject = {}) {
  const cleanItem = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, val] of Object.entries(apiObject)) {
    cleanItem[key.replace(/\d+\.\s+/gi, '')] = val;
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

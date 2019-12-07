const seen = [];

module.exports = function filterNode(node, keys) {
  if (seen.includes(node)) {
    return node;
  }
  if (typeof node !== "object") {
    return node;
  }
  if (Array.isArray(node)) {
    for (const entry of node) {
      seen.push(entry);
      node[entry] = filterNode(entry, keys);
      seen.pop();
    }
    return node;
  }
  for (const key of Object.keys(node)) {
    if (keys.includes(key)) {
      node[key] = "[...]";
    } else {
      seen.push(node[key]);
      node[key] = filterNode(node[key], keys);
      seen.pop();
    }
  }
  return node;
};

const isRadio = node => node.tagName === 'INPUT' && node.type === 'radio';

const findSelectedRadio = (node, nodes) => (
  nodes
    .filter(isRadio)
    .filter(el => el.name === node.name)
    .filter(el => el.checked)[0]
  || node
);

export const correctNode = (node, nodes) => {
  if (isRadio(node) && node.name) {
    return findSelectedRadio(node, nodes);
  }
  return node;
};

export const correctNodes = (nodes) => {
  // IE11 has no Set constructor
  const resultSet = new Set();
  nodes.forEach(node => resultSet.add(correctNode(node, nodes)));
  // using filter to support IE11
  return nodes.filter(node => resultSet.has(node));
};

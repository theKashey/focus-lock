const findFormParent = (startNode) => {
  let node = startNode;
  while (node = node.parentNode) {
    if (node.tagName === 'FORM') {
      return node;
    }
  }
  return null;
};

const isRadio = (node) => node.tagName === 'INPUT' && node.type === 'radio';

const findSelectedRadio = (node, nodes) => (
  nodes
    .filter(isRadio)
    .filter(el => el.name === node.name)
    .find(el => el.checked)
  || node
);

const pickFirstFocus = (nodes) => {
  if (nodes[0] && nodes.length > 1) {
    if (isRadio(nodes[0]) && nodes[0].name) {
      return findSelectedRadio(nodes[0], nodes);
    }
  }
  return nodes[0];
};

export default pickFirstFocus;
const isRadio = node => node.tagName === 'INPUT' && node.type === 'radio';

const findSelectedRadio = (node, nodes) => {
  const filteredNodes = nodes.filter(isRadio).filter(el => el.name === node.name);
  for (let i = 0; i < filteredNodes.length; i += 1) {
    if (filteredNodes[i].checked) return filteredNodes[i];
  }
  return node;
};

const pickFirstFocus = (nodes) => {
  if (nodes[0] && nodes.length > 1) {
    if (isRadio(nodes[0]) && nodes[0].name) {
      return findSelectedRadio(nodes[0], nodes);
    }
  }
  return nodes[0];
};

export default pickFirstFocus;

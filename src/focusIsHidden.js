import { toArray } from './utils/array';
import { FOCUS_ALLOW } from './constants';

const focusIsHidden = () => (
  document && toArray(document.querySelectorAll(`[${FOCUS_ALLOW}]`)).some(node => node.contains(document.activeElement))
);

export default focusIsHidden;

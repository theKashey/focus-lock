import { focusOn } from './commands';
import { getTabbableNodes, contains, getFocusableNodes } from './utils/DOMutils';
import { asArray } from './utils/array';
import { NodeIndex } from './utils/tabOrder';

// eslint-disable-next-line @typescript-eslint/ban-types
type UnresolvedSolution = {};
type ResolvedSolution = {
  prev: NodeIndex;
  next: NodeIndex;
  first: NodeIndex;
  last: NodeIndex;
};

/**
 * for a given `element` in a given `scope` returns focusable siblings
 * @param element - base element
 * @param scope - common parent. Can be document, but better to narrow it down for performance reasons
 * @returns {prev,next} - references to a focusable element before and after
 * @returns undefined - if operation is not applicable
 */
export const getRelativeFocusable = (
  element: Element,
  scope: HTMLElement | HTMLElement[],
  useTabbables: boolean
): UnresolvedSolution | ResolvedSolution | undefined => {
  if (!element || !scope) {
    console.error('no element or scope given');

    return {};
  }

  const shards = asArray(scope);

  if (shards.every((shard) => !contains(shard as Element, element))) {
    console.error('Active element is not contained in the scope');

    return {};
  }

  const focusables = useTabbables
    ? getTabbableNodes(shards as HTMLElement[], new Map())
    : getFocusableNodes(shards as HTMLElement[], new Map());
  const current = focusables.findIndex(({ node }) => node === element);

  if (current === -1) {
    // an edge case, when anchor element is not found
    return undefined;
  }

  return {
    prev: focusables[current - 1],
    next: focusables[current + 1],
    first: focusables[0],
    last: focusables[focusables.length - 1],
  };
};

const getBoundary = (shards: HTMLElement | HTMLElement[], useTabbables: boolean) => {
  const set = useTabbables
    ? getTabbableNodes(asArray(shards) as HTMLElement[], new Map())
    : getFocusableNodes(asArray(shards) as HTMLElement[], new Map());

  return {
    first: set[0],
    last: set[set.length - 1],
  };
};

type ScopeRef = HTMLElement | HTMLElement[];
interface FocusNextOptions {
  /**
   * the component to "scope" focus in
   * @default document.body
   */
  scope?: ScopeRef;
  /**
   * enables cycling inside the scope
   * @default true
   */
  cycle?: boolean;
  /**
   * options for focus action to control it more precisely (ie. `{ preventScroll: true }`)
   */
  focusOptions?: FocusOptions;
  /**
   * scopes to only tabbable elements
   * set to false to include all focusable elements (tabindex -1)
   * @default true
   */
  onlyTabbable?: boolean;
}

const defaultOptions = (options: FocusNextOptions) =>
  Object.assign(
    {
      scope: document.body,
      cycle: true,
      onlyTabbable: true,
    },
    options
  );

const moveFocus = (
  fromElement: Element | undefined,
  options: FocusNextOptions = {},
  cb: (solution: Partial<ResolvedSolution>, cycle: boolean) => NodeIndex | undefined | false
) => {
  const newOptions = defaultOptions(options);
  const solution = getRelativeFocusable(fromElement as Element, newOptions.scope, newOptions.onlyTabbable);

  if (!solution) {
    return;
  }

  const target = cb(solution, newOptions.cycle);

  if (target) {
    focusOn(target.node, newOptions.focusOptions);
  }
};

/**
 * focuses next element in the tab-order
 * @param fromElement - common parent to scope active element search or tab cycle order
 * @param {FocusNextOptions} [options] - focus options
 */
export const focusNextElement = (fromElement: Element, options: FocusNextOptions = {}): void => {
  moveFocus(fromElement, options, ({ next, first }, cycle) => next || (cycle && first));
};

/**
 * focuses prev element in the tab order
 * @param fromElement - common parent to scope active element search or tab cycle order
 * @param {FocusNextOptions} [options] - focus options
 */
export const focusPrevElement = (fromElement: Element, options: FocusNextOptions = {}): void => {
  moveFocus(fromElement, options, ({ prev, last }, cycle) => prev || (cycle && last));
};

type FocusBoundaryOptions = Pick<FocusNextOptions, 'focusOptions' | 'onlyTabbable'>;

const pickBoundary = (scope: ScopeRef, options: FocusBoundaryOptions, what: 'last' | 'first') => {
  const boundary = getBoundary(scope, options.onlyTabbable ?? true);
  const node = boundary[what];

  if (node) {
    focusOn(node.node, options.focusOptions);
  }
};

/**
 * focuses first element in the tab-order
 * @param {FocusNextOptions} options - focus options
 */
export const focusFirstElement = (scope: ScopeRef, options: FocusBoundaryOptions = {}): void => {
  pickBoundary(scope, options, 'first');
};

/**
 * focuses last element in the tab order
 * @param {FocusNextOptions} options - focus options
 */
export const focusLastElement = (scope: ScopeRef, options: FocusBoundaryOptions = {}): void => {
  pickBoundary(scope, options, 'last');
};

import { FOCUS_ALLOW, FOCUS_DISABLED, FOCUS_NO_AUTOFOCUS } from '../src/constants';
import { filterAutoFocusable, getAllTabbableNodes } from '../src/utils/DOMutils';

describe('focusables', () => {
  it('should remove disabled buttons', () => {
    document.body.innerHTML = `    
            <button>normal button</button>
            <button disabled>disabled button (remove)</button>
            <button aria-disabled="true">aria-disabled button</button> 
            <button style="display: none">hidden button (remove)</button>
        `;

    const cache = new Map();
    const nodes = getAllTabbableNodes([document.body], cache).map(({ node }) => node);

    expect(nodes.map((el) => el.textContent)).toEqual([
      // because it's normal button
      'normal button',
      // because it's "marked" as disabled for ARIA only
      'aria-disabled button',
    ]);
  });
});

describe('auto-focusables', () => {
  it('should pick correct first autofocus', () => {
    document.body.innerHTML = `    
            <button>normal button</button>
            <button disabled>disabled button  (remove)</button>
            <button aria-disabled="true">aria-disabled button</button>
            <button ${FOCUS_NO_AUTOFOCUS}="true">skip autofocus (remove)</button> 
            <button tabindex="-1">tabindex-1 button</button>
            <div ${FOCUS_ALLOW}="true">
                <button>normal button in allow group</button>
            </div>
            <div ${FOCUS_DISABLED}="true">
                <button>normal button in disabled group</button>
            </div>
            <div ${FOCUS_NO_AUTOFOCUS}="true">
                <button>normal button in no autofocus group (remove)</button>
            </div>
        `;

    const cache = new Map();
    const nodes = getAllTabbableNodes([document.body], cache).map(({ node }) => node);

    expect(filterAutoFocusable(nodes).map((el) => el.textContent)).toEqual([
      // hoisted
      'tabindex-1 button',
      'normal button',
      'aria-disabled button',
      'normal button in allow group',
      'normal button in disabled group',
    ]);
  });
});

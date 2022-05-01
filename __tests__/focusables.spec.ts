import { filterFocusable } from '../src/utils/DOMutils';

describe('focusables', () => {
  it('should remove disabled buttons', () => {
    document.body.innerHTML = `    
            <button>normal button</button>
            <button disabled>disabled button</button>
            <button aria-disabled="true">aria-disabled button</button> 
            <button style="display: none">hidden button</button>
        `;

    expect(
      filterFocusable(Array.from(document.body.querySelectorAll('*')), new Map()).map((el) => el.textContent)
    ).toEqual([
      // because it's normal button
      'normal button',
      // because it's "marked" as disabled for ARIA only
      'aria-disabled button',
    ]);
  });
});

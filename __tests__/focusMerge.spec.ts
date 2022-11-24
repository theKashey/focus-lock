import { focusInside, focusMerge } from '../src';
import { FOCUS_AUTO } from '../src/constants';

describe('FocusMerge', () => {
  const createTest = () => {
    document.body.innerHTML = `    
    <div id="d1"> 
    <button>1</button>
    <button>2</button>
    </div>
    <div id="d2">
    <button>3</button>
    <button>4</button>
    </div>
    <div id="d3">
    <button>3</button>
    <button>4</button>
    </div>
    <div id="d4" tabindex="0">    
    </div>
    `;
  };

  const querySelector = (q: string): HTMLElement => document.querySelector<HTMLElement>(q)!;

  it('move focus', () => {
    createTest();
    querySelector('#d4').focus();

    expect(focusMerge(querySelector('#d4'), null)).toBe(undefined);

    // @ts-ignore
    focusMerge(querySelector('#d1'), null)!.node.focus();
    expect(focusInside(querySelector('#d1'))).toBe(true);

    // @ts-ignore
    focusMerge(querySelector('#d2'), null)!.node.focus();
    expect(focusInside(querySelector('#d2'))).toBe(true);

    expect(focusMerge([querySelector('#d2'), querySelector('#d3')], null)).toBe(undefined);
    expect(focusInside(querySelector('#d2'))).toBe(true);

    // @ts-ignore
    focusMerge([querySelector('#d3'), querySelector('#d4')], null)!.node.focus();
    expect(focusInside(querySelector('#d3'))).toBe(true);
  });

  it('autofocus - should pick first available tabbable', () => {
    document.body.innerHTML = `    
        <div id="d1"> 
        <span>
            <button tabindex="-1">1</button>
        </span>
        <button>2</button>
        </div>    
    `;

    expect(focusMerge(querySelector('#d1'), null)!.node.innerHTML).toBe('2');
  });

  it('autofocus - should pick first available tabbable | first ignored', () => {
    document.body.innerHTML = `    
        <div id="d1"> 
        <span>
            <button tabindex="-1">1</button>
        </span>
        <button data-no-autofocus>2</button>
        <button>3</button>
        </div>    
    `;

    expect(focusMerge(querySelector('#d1'), null)!.node.innerHTML).toBe('3');
  });

  it('autofocus - should pick first available focusable if pointed', () => {
    document.body.innerHTML = `    
        <div id="d1"> 
        <span ${FOCUS_AUTO}>
            <button tabindex="-1">1</button>
        </span>
        <button>2</button>
        </div>    
    `;

    expect(focusMerge(querySelector('#d1'), null)!.node.innerHTML).toBe('1');
  });

  describe('data-autofocus', () => {
    it('autofocus - should pick first available focusable if pointed directly', () => {
      document.body.innerHTML = `    
        <div id="d1">         
        <button>1</button>
        <button data-autofocus disabled>disabled</button>        
        <button data-autofocus>2</button>
        <button>3</button>
        </div>    
    `;

      expect(focusMerge(querySelector('#d1'), null)!.node.innerHTML).toBe('2');
    });

    it('autofocus - false value', () => {
      document.body.innerHTML = `    
        <div id="d1">         
        <button>1</button>        
        <button data-autofocus="false">2</button>
        <button>3</button>
        </div>    
    `;

      expect(focusMerge(querySelector('#d1'), null)!.node.innerHTML).toBe('1');
    });

    it('autofocus - nothing to focus', () => {
      document.body.innerHTML = `    
        <div id="d1">         
        <button disabled>1</button>        
        </div>    
    `;

      expect(focusMerge(querySelector('#d1'), null)!).toBe(undefined);
    });
  });
});

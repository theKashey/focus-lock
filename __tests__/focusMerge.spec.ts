import { focusInside, focusSolver } from '../src';
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

    expect(focusSolver(querySelector('#d4'), null)).toBe(undefined);

    // @ts-ignore
    focusSolver(querySelector('#d1'), null)!.node.focus();
    expect(focusInside(querySelector('#d1'))).toBe(true);

    // @ts-ignore
    focusSolver(querySelector('#d2'), null)!.node.focus();
    expect(focusInside(querySelector('#d2'))).toBe(true);

    expect(focusSolver([querySelector('#d2'), querySelector('#d3')], null)).toBe(undefined);
    expect(focusInside(querySelector('#d2'))).toBe(true);

    // @ts-ignore
    focusSolver([querySelector('#d3'), querySelector('#d4')], null)!.node.focus();
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

    expect(focusSolver(querySelector('#d1'), null)!.node.innerHTML).toBe('2');
  });

  it('autofocus - should pick first available exotic tabbable', () => {
    document.body.innerHTML = `    
        <div id="d1"> 
        <span>
            <div contenteditable="true">1</div>
        </span>
        <button>2</button>
        </div>    
    `;

    expect(focusSolver(querySelector('#d1'), null)!.node.innerHTML).toBe('1');
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

    expect(focusSolver(querySelector('#d1'), null)!.node.innerHTML).toBe('3');
  });

  it('autofocus - should pick first available focusable if pointed by AUTOFOCUS', () => {
    document.body.innerHTML = `    
        <div id="d1"> 
        <span ${FOCUS_AUTO}>
            <button tabindex="-1">1</button>
        </span>
        <button>2</button>
        </div>    
    `;

    expect(focusSolver(querySelector('#d1'), null)!.node.innerHTML).toBe('1');
  });

  it('autofocus - ignores inert attributes', () => {
    document.body.innerHTML = `    
        <div id="d1"> 
        <span inert>
            <button>1</button>
        </span>
        <button>2</button>
        </div>    
    `;

    expect(focusSolver(querySelector('#d1'), null)!.node.innerHTML).toBe('2');
  });

  describe('return behavior', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <button id="d0" tabindex="0">base</button>    
        <div id="d1"> 
        <button id="d2"tabindex="-1">1</button>
        <span id="d3">2</span>
        <button>3</button>
        </div>    
    `;
    });

    it('should first tabbable', () => {
      expect(focusSolver(querySelector('#d1'), null)!.node.innerHTML).toBe('3');
    });

    it('should focusable if pointed', () => {
      expect(focusSolver(querySelector('#d1'), querySelector('#d2'))!.node.innerHTML).toBe('1');
    });

    it('should first tabbable if target lost', () => {
      // TODO: this test might corrected by smarter returnFocus
      expect(focusSolver(querySelector('#d1'), querySelector('#d3'))!.node.innerHTML).toBe('3');
    });
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

      expect(focusSolver(querySelector('#d1'), null)!.node.innerHTML).toBe('2');
    });

    it('autofocus - false value', () => {
      document.body.innerHTML = `    
        <div id="d1">         
        <button>1</button>        
        <button data-autofocus="false">2</button>
        <button>3</button>
        </div>    
    `;

      expect(focusSolver(querySelector('#d1'), null)!.node.innerHTML).toBe('1');
    });

    it('autofocus - nothing to focus', () => {
      document.body.innerHTML = `    
        <div id="d1">         
        <button disabled>1</button>        
        </div>    
    `;

      expect(focusSolver(querySelector('#d1'), null)!).toBe(undefined);
    });
  });
});

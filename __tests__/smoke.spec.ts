import { focusInside, focusMerge } from '../src/';
import { FOCUS_AUTO } from '../src/constants';

describe('smoke', () => {
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

  describe('FocusInside', () => {
    it('false - when there is no focus', () => {
      createTest();
      expect(focusInside(document.body)).toBe(true);
      expect(focusInside(querySelector('#d1')!)).toBe(false);
      expect(focusInside(querySelector('#d2'))).toBe(false);
      expect(focusInside(querySelector('#d3'))).toBe(false);
      expect(focusInside(querySelector('#d4'))).toBe(false);
    });

    it('true - when focus in d1', () => {
      createTest();
      querySelector('#d1 button').focus();
      expect(focusInside(document.body)).toBe(true);
      expect(focusInside(querySelector('#d1'))).toBe(true);
      expect(focusInside(querySelector('#d2'))).toBe(false);
    });

    it('true - when focus on d4 (tabbable)', () => {
      createTest();
      querySelector('#d4').focus();
      expect(focusInside(document.body)).toBe(true);
      expect(focusInside(querySelector('#d4'))).toBe(true);
      expect(focusInside(querySelector('#d1'))).toBe(false);
    });

    it('multi-test', () => {
      createTest();
      querySelector('#d1 button').focus();
      expect(focusInside(document.body)).toBe(true);
      expect(focusInside(querySelector('#d1'))).toBe(true);
      expect(focusInside([querySelector('#d1')])).toBe(true);
      expect(focusInside([querySelector('#d2')])).toBe(false);
      expect(focusInside([querySelector('#d1'), querySelector('#d2')])).toBe(true);
      expect(focusInside([querySelector('#d2'), querySelector('#d3')])).toBe(false);
      expect(focusInside([querySelector('#d3'), querySelector('#d1')])).toBe(true);
    });
  });

  describe('FocusMerge', () => {
    it('move focus', () => {
      createTest();
      querySelector('#d4').focus();

      expect(focusMerge(querySelector('#d4'), null)).toBe(undefined);

      focusMerge(querySelector('#d1'), null)!.node.focus();
      expect(focusInside(querySelector('#d1'))).toBe(true);

      focusMerge(querySelector('#d2'), null)!.node.focus();
      expect(focusInside(querySelector('#d2'))).toBe(true);

      expect(focusMerge([querySelector('#d2'), querySelector('#d3')], null)).toBe(undefined);
      expect(focusInside(querySelector('#d2'))).toBe(true);

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
  });
});

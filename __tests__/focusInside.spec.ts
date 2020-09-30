import { focusInside } from '../src/';

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
});

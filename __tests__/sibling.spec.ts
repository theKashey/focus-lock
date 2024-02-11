import { focusNextElement, focusPrevElement } from '../src/';

describe('smoke', () => {
  const createTest = () => {
    document.body.innerHTML = `    
    <div id="d1"> 
    <button id="first">1</button>
    <button>2</button>
    </div>    
    <button tabindex="-1">negative</button>
    <div id="d2">
    <button>3</button>
    <button id="b4">4</button>
    </div>
    <div id="d3">
    <button>5</button>
    <button>6</button>
    </div>    
    </div>
    `;
  };

  const querySelector = (q: string): HTMLElement => document.querySelector<HTMLElement>(q)!;

  beforeEach(() => {
    createTest();
    document.getElementById('first')?.focus();
  });

  it('focus button1', () => {
    querySelector('#d1 button').focus();
  });

  it('cycle forward', () => {
    expect(document.activeElement!.innerHTML).toBe('1');
    focusNextElement(document.activeElement!);
    expect(document.activeElement!.innerHTML).toBe('2');
    focusNextElement(document.activeElement!);
    expect(document.activeElement!.innerHTML).toBe('3');
    focusNextElement(document.activeElement!);
    expect(document.activeElement!.innerHTML).toBe('4');
    focusNextElement(document.activeElement!);
    expect(document.activeElement!.innerHTML).toBe('5');
    focusNextElement(document.activeElement!);
    expect(document.activeElement!.innerHTML).toBe('6');
    focusNextElement(document.activeElement!);
    expect(document.activeElement!.innerHTML).toBe('1');
  });

  it('cycle forward via negavite', () => {
    expect(document.activeElement!.innerHTML).toBe('1');
    focusNextElement(document.activeElement!, { onlyTabbable: false });
    expect(document.activeElement!.innerHTML).toBe('2');
    focusNextElement(document.activeElement!, { onlyTabbable: false });
    expect(document.activeElement!.innerHTML).toBe('negative');
    focusNextElement(document.activeElement!, { onlyTabbable: false });
    expect(document.activeElement!.innerHTML).toBe('3');
  });

  it('cycle backward', () => {
    expect(document.activeElement!.innerHTML).toBe('1');
    focusPrevElement(document.activeElement!);
    expect(document.activeElement!.innerHTML).toBe('6');
    focusPrevElement(document.activeElement!);
    expect(document.activeElement!.innerHTML).toBe('5');
    focusPrevElement(document.activeElement!);
    expect(document.activeElement!.innerHTML).toBe('4');
  });

  it('works with a scope', () => {
    const parent = querySelector('#d2');
    document.getElementById('b4')?.focus();

    expect(document.activeElement!.innerHTML).toBe('4');
    focusNextElement(document.activeElement!, { scope: parent });
    expect(document.activeElement!.innerHTML).toBe('3');
    focusNextElement(document.activeElement!, { scope: parent });
    expect(document.activeElement!.innerHTML).toBe('4');
    focusNextElement(document.activeElement!, { scope: parent, cycle: false });
    expect(document.activeElement!.innerHTML).toBe('4');
  });
});

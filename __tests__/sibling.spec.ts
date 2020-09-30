import { focusNextElement, focusPrevElement } from '../src/';

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
    <button>5</button>
    <button>6</button>
    </div>    
    </div>
    `;
  };

  const querySelector = (q: string): HTMLElement => document.querySelector<HTMLElement>(q)!;

  it('init', () => {
    createTest();
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

    expect(document.activeElement!.innerHTML).toBe('4');
    focusNextElement(document.activeElement!, { scope: parent });
    expect(document.activeElement!.innerHTML).toBe('3');
    focusNextElement(document.activeElement!, { scope: parent });
    expect(document.activeElement!.innerHTML).toBe('4');
    focusNextElement(document.activeElement!, { scope: parent, cycle: false });
    expect(document.activeElement!.innerHTML).toBe('4');
  });
});

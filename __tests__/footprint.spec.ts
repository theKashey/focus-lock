import { focusSolver } from '../src';

describe('Complexity footprint', () => {
  const createTest = (n: number) => {
    document.body.innerHTML = `    
    <div id="d1"> 
       <button id="b1">1</button>
       ${Array(n)
         .fill(1)
         .map((_, index) => `<button>${index}</button>`)
         .join('\n')}                        
    </div>    
    <div id="d2"> 
       <button id="b2">1</button>
       ${Array(n)
         .fill(1)
         .map((_, index) => `<button>${index}</button>`)
         .join('\n')}
    </div>
    `;
  };

  const querySelector = (q: string): HTMLElement => document.querySelector<HTMLElement>(q)!;

  beforeEach(() => {
    const { getComputedStyle } = window;
    jest.spyOn(window, 'getComputedStyle').mockImplementation(getComputedStyle);
  });

  afterEach(() => {
    (window.getComputedStyle as unknown as jest.SpyInstance).mockRestore();
  });

  it('known operation complexity - no focus', () => {
    createTest(3);
    focusSolver(querySelector('#d1'), null);
    expect(window.getComputedStyle).toBeCalledTimes(12);
  });

  it('known operation complexity - no focus + 1', () => {
    createTest(3 + 1);
    focusSolver(querySelector('#d1'), null);
    expect(window.getComputedStyle).toBeCalledTimes(14);
  });

  it('known operation complexity - has focus inside', () => {
    createTest(4);
    querySelector('#b1').focus();
    focusSolver(querySelector('#d1'), null);
    expect(window.getComputedStyle).toBeCalledTimes(8);
  });

  it('known operation complexity - has focus inside + 1', () => {
    createTest(4 + 1);
    querySelector('#b1').focus();
    focusSolver(querySelector('#d1'), null);
    expect(window.getComputedStyle).toBeCalledTimes(9);
  });
});

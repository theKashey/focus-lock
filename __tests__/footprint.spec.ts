import { focusMerge } from '../src';

describe('Complexity footprint', () => {
  const createTest = () => {
    document.body.innerHTML = `    
    <div id="d1"> 
       <button id="b1">1</button>
       <button>2</button>       
    </div>    
    <div id="d2"> 
       <button id="b2">1</button>
       <button>2</button>
    </div>
    `;
  };

  const querySelector = (q: string): HTMLElement => document.querySelector<HTMLElement>(q)!;

  beforeEach(() => {
    const { getComputedStyle } = window;
    jest.spyOn(window, 'getComputedStyle').mockImplementation(getComputedStyle);
  });

  afterEach(() => {
    ((window.getComputedStyle as unknown) as jest.SpyInstance).mockRestore();
  });

  it('known operation complexity - no focus', () => {
    createTest();
    focusMerge(querySelector('#d1'), null);
    expect(window.getComputedStyle).toBeCalledTimes(32);
  });

  it('known operation complexity - has focus inside', () => {
    createTest();
    querySelector('#b1').focus();
    focusMerge(querySelector('#d1'), null);
    expect(window.getComputedStyle).toBeCalledTimes(24);
  });
});

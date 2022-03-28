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

  const createShadowTest = (nested?: boolean) => {
    const html = `
      <div id="app">
        <div id="nonshadow">
          <input />
          <button>I am a button</button>
        </div>
        <div id="shadowdom"></div>
      </div>`;
    const shadowHtml = `
      <div id="first"></div>
      <button id="firstBtn">first button</button>
      <div id="last">
        <button id="secondBtn">second button</button>
      </div>
      `;
    document.body.innerHTML = html;

    const shadowContainer = document.getElementById('shadowdom') as HTMLElement;
    const root = shadowContainer.attachShadow({ mode: 'open' });
    const shadowDiv = document.createElement('div');
    shadowDiv.innerHTML = shadowHtml;
    root.appendChild(shadowDiv);

    if (nested) {
      const firstDiv = root.querySelector('#first') as HTMLDivElement;
      const nestedRoot = firstDiv.attachShadow({ mode: 'open' });
      const nestedShadowDiv = document.createElement('div');

      nestedShadowDiv.innerHTML = shadowHtml;
      nestedRoot.appendChild(nestedShadowDiv);
    }
  };

  describe('with shadow dom', () => {
    it('false when the focus is within a shadow dom not within the topNode', () => {
      createShadowTest();

      const nonShadowDiv = querySelector('#nonshadow');

      const shadowBtn = querySelector('#shadowdom')?.shadowRoot?.querySelector('#firstBtn') as HTMLButtonElement;

      shadowBtn.focus();

      expect(focusInside(document.body)).toBe(true);
      expect(focusInside(nonShadowDiv)).toBe(false);
    });

    it('false when topNode is shadow sibling of focused node', () => {
      createShadowTest();

      const shadowHost = querySelector('#shadowdom');

      const shadowBtn = shadowHost.shadowRoot?.querySelector('#firstBtn') as HTMLButtonElement;
      const shadowDivLast = shadowHost.shadowRoot?.querySelector('#last') as HTMLDivElement;

      shadowBtn.focus();

      expect(focusInside(document.body)).toBe(true);
      expect(focusInside(shadowDivLast)).toBe(false);
    });

    it('true when focus is within shadow dom within topNode', () => {
      createShadowTest();

      const shadowHost = querySelector('#shadowdom');

      const shadowDivLast = shadowHost.shadowRoot?.querySelector('#last') as HTMLDivElement;
      const shadowBtn = shadowHost.shadowRoot?.querySelector('#secondBtn') as HTMLButtonElement;

      shadowBtn.focus();

      expect(focusInside(document.body)).toBe(true);
      expect(focusInside(shadowHost)).toBe(true);
      expect(focusInside(shadowDivLast)).toBe(true);
    });

    it('true when focus is within nested shadow dom', () => {
      createShadowTest(true);

      const shadowHost = querySelector('#shadowdom');
      const nestedShadowHost = shadowHost.shadowRoot?.querySelector('#first') as HTMLDivElement;

      const nestedShadowDiv = nestedShadowHost.shadowRoot?.querySelector('#first') as HTMLDivElement;
      const nestedShadowDivLast = nestedShadowHost.shadowRoot?.querySelector('#last') as HTMLDivElement;
      const nestedShadowButton = nestedShadowDivLast.querySelector('#secondBtn') as HTMLButtonElement;

      nestedShadowButton.focus();

      expect(focusInside(document.body)).toBe(true);
      expect(focusInside(shadowHost)).toBe(true);
      expect(focusInside(nestedShadowHost)).toBe(true);
      expect(focusInside(nestedShadowDiv)).toBe(false);
      expect(focusInside(nestedShadowDivLast)).toBe(true);
    });
  });
});
